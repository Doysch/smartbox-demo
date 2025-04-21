// tools/gptQueryGeneratePrompt/sendQueries.it.js

import algoliasearch from 'algoliasearch';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import 'dotenv/config';

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('smartbox_boxes_CH-it');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const totalQueries = 1000;
const delayMs = 50;

async function fetchQueryBaseData() {
  const { hits } = await index.search('', {
    hitsPerPage: 200,
    attributesToRetrieve: ['webTitle', 'boxUniverse', 'boxSubUniverse']
  });

  return hits.map(hit => {
    const webTitle = hit.webTitle?.trim();
    const universe = hit.boxUniverse?.trim();
    const subUniverse = hit.boxSubUniverse?.trim();

    return [webTitle, universe, subUniverse].filter(Boolean).join(' - ');
  }).filter(Boolean);
}

async function generateNaturalQueries(basePhrases, count = 1000) {
  const prompt = `Ecco alcuni esempi di titoli di prodotti:

${basePhrases.slice(0, 50).map((q, i) => `${i + 1}. ${q}`).join('\n')}

Basandoti su questi titoli, genera ${count} query di ricerca naturali che gli utenti potrebbero digitare.
Il formato deve essere JSON, come questo:

[
  { "query": "titolo in italiano", "searchCount": 3 },
  ...
]

Le query devono essere in italiano, massimo 5 parole, e devono sembrare vere ricerche utente.`;

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Sei un assistente utile che scrive solo in italiano.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  const match = chatResponse.choices[0].message.content.match(/\[.*\]/s);
  if (!match) throw new Error('Could not parse response JSON.');

  return JSON.parse(match[0]);
}

async function sendQueries() {
  console.log('Fetching base phrases from Algolia...');
  const basePhrases = await fetchQueryBaseData();
  console.log(`Fetched ${basePhrases.length} base phrases.`);

  console.log('Generating natural queries via GPT...');
  const queries = await generateNaturalQueries(basePhrases, 50);
  console.log(`Generated ${queries.length} queries.`);

  const repeatedCount = 100;
  const fallbackQuery = "regalo esperienza insolita";
  const repeatedQuery = queries[0]?.query || fallbackQuery;

  const repeated = Array.from({ length: repeatedCount }, () => ({
    query: repeatedQuery,
    userToken: uuidv4(),
  }));

  const remaining = Array.from({ length: totalQueries - repeatedCount }, (_, i) => {
    const queryObj = queries[i % queries.length];
    return {
      query: queryObj?.query || fallbackQuery,
      userToken: uuidv4(),
    };
  });

  const allQueries = [...repeated, ...remaining];

  let sentCount = 0;
  function sendNext() {
    if (sentCount >= allQueries.length) {
      return console.log(' Done sending all queries.');
    }

    const { query, userToken } = allQueries[sentCount];

    index.search(query, { userToken })
      .then(() => console.log(`[${sentCount + 1}] Sent: "${query}" (${userToken})`))
      .catch(console.error);

    sentCount++;
    setTimeout(sendNext, delayMs);
  }

  sendNext();
}

sendQueries();
