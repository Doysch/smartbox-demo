// scripts/queries/simulateCategoryPageDRR.js
import algoliasearch from "algoliasearch";
import { v4 as uuidv4 } from "uuid";

const appId = "OA5TOH2VFB";
const searchApiKey = "d40e78f30117a2d30a5d851eacd30140";
const insightsApiKey = "d40e78f30117a2d30a5d851eacd30140";
const indexName = "smartbox_boxes_CH-fr";
const categoryFilter = "filters.occasions:Anniversaire"; // Example filter, adjust as needed

const objectIDs = [
  "122161001",
  "122160001",
  "122158001",
  "122157001",
  "122155001",
  "122153001",
  "122149001",
  "122146001",
  "122144001",
  "122142001",
  "122140001",
  "122139001",
  "122138001",
  "122137001",
  "122136001",
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
        "X-Algolia-API-Key": insightsApiKey,
        "X-Algolia-Application-Id": appId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ events: [event] }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("❌ Event error:", error);
    } else {
      console.log(
        `✅ ${event.eventType.toUpperCase()} ${event.eventName} sent for ${
          event.userToken
        }`
      );
    }
  } catch (err) {
    console.error("❌ Failed to send event:", err);
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
      console.error("❌ No queryID returned");
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

    console.log(`🔁 Done: ${i + 1}/${numQueries} for ${userToken}\n`);
    await sleep(1000);
  }
}

simulate();
