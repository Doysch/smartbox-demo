// scripts/queries/simulateCategoryPageDRR.js
import algoliasearch from "algoliasearch";
import { v4 as uuidv4 } from "uuid";
require('dotenv').config();


const appId = process.env.ALGOLIA_APP_ID;
const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY
const indexName = "indexName"; // Replace with your index name
const categoryFilter = "facetName.facetValue";  // Replace with your filter

const objectIDs = [
  "121944001",
  "121943001",
  "121942001",
  "121941001",
  "121936001",
  "121935001",
  "121934001",
  "121933001",
  "121932001",
  "121885001",
  "121865001",
  "121862001",
  "121861001",
  "121849001",
  "121848001",
  "121847001",
  "121846001",
  "121843001",
  "121841001",
  "121838001",
  "121825001",
];

const numQueries = 50;
const searchClient = algoliasearch(appId, searchApiKey);
const index = searchClient.initIndex(indexName);

function getRandomPrice() {
  return Math.floor(Math.random() * (500 - 20 + 1)) + 20;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEvent(event) {
  try {
    const res = await fetch("https://insights.algolia.io/1/events", {
      method: "POST",
      headers: {
        "X-Algolia-API-Key": searchApiKey,
        "X-Algolia-Application-Id": appId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ events: [event] }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Event error:", error);
    } else {
      console.log(
        `${event.eventType.toUpperCase()} ${event.eventName} sent for ${
          event.userToken
        }`
      );
    }
  } catch (err) {
    console.error("Failed to send event:", err);
  }
}

async function simulate() {
  for (let i = 0; i < numQueries; i++) {
    const userToken = `anonymous-${uuidv4()}`;
    const selectedObjects = objectIDs
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

      const analyticsTags = Math.random() < 0.75 ? ["mobile"] : ["desktop"];

      const searchRes = await index.search("", {
        facetFilters: [[categoryFilter]],
        userToken,
        clickAnalytics: true,
        analyticsTags,
      });

    const queryID = searchRes?.queryID;
    if (!queryID) {
      console.error("No queryID returned");
      continue;
    }

    const [objectID1, objectID2] = selectedObjects;
    const positions = Math.floor(Math.random() * 10) + 1;
    const price1 = getRandomPrice();
    const price2 = getRandomPrice();

    // Send 10 click events
    for (let j = 0; j < 10; j++) {
      await sendEvent({
        eventType: "click",
        eventName: "Box Clicked",
        index: indexName,
        userToken,
        objectIDs: [objectID1],
        positions: [Math.floor(Math.random() * 10) + 1],
        queryID,
      });

      await sleep(100);
    }

    // Send 7 add-to-cart events
    for (let j = 0; j < 7; j++) {
      await sendEvent({
        eventType: "conversion",
        eventName: "Added to Cart",
        index: indexName,
        userToken,
        queryID,
        objectIDs: [objectID1, objectID2],
        objectData: [
          { price: price1, quantity: 1 },
          { price: price2, quantity: 1 },
        ],
        value: price1 + price2,
        currency: "EUR",
      });
      await sleep(150);
    }

    // Send 7 purchase events
    for (let j = 0; j < 7; j++) {
      await sendEvent({
        eventType: "conversion",
        eventName: "Purchase",
        index: indexName,
        userToken,
        queryID,
        objectIDs: [objectID1, objectID2],
        objectData: [
          { price: price1, quantity: 1 },
          { price: price2, quantity: 1 },
        ],
        value: price1 + price2,
        currency: "EUR",
      });
      await sleep(150);
    }

    console.log(`Done: ${i + 1}/${numQueries} for ${userToken}\n`);
    await sleep(1000);
  }
}

simulate();
