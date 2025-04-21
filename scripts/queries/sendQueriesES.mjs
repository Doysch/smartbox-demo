// tools/gptQueryGeneratePrompt/sendQueries-es.mjs

import algoliasearch from 'algoliasearch';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import 'dotenv/config';

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('smartbox_boxes_ES-es');

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
  const prompt = `Aquí tienes algunos ejemplos de títulos de productos:

${basePhrases.slice(0, 50).map((q, i) => `${i + 1}. ${q}`).join('\n')}

Basándote en estos títulos, genera ${count} consultas de búsqueda naturales que los usuarios podrían escribir. 
La salida debe estar en formato JSON, como se muestra a continuación:

[
  { "query": "título en español", "searchCount": 3 },
  ...
]

Las consultas deben estar en español, contener un máximo de 5 palabras, y parecer búsquedas reales de usuarios.`;

  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Eres un asistente útil que solo escribe en español.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  const match = chatResponse.choices[0].message.content.match(/\[.*\]/s);
  if (!match) throw new Error('No se pudo analizar el JSON de la respuesta.');

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
  const fallbackQuery = "regalo experiencia única";
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
      return console.log('✅ Envío de todas las consultas completado.');
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