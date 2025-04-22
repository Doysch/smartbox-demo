require('dotenv').config();
const fs = require('fs');
const algoliasearch = require('algoliasearch');
const camelCase = require('lodash.camelcase');
import { Star, Users, MapPin, Truck, Tag } from 'lucide-react';


// Utility to camelCase keys
function camelCaseKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(camelCaseKeys);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[camelCase(key)] = camelCaseKeys(value);
      return acc;
    }, {});
  }
  return obj;
}

// Setup Algolia client
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

// Load and camelCase all records
const rawRecords = JSON.parse(fs.readFileSync('data/processed/ES-es.final.json', 'utf8'));
const records = rawRecords.map(record => {
  const camelCased = camelCaseKeys(record);
  return {
    ...camelCased,
    average_rating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1.0 to 5.0
    review_count: Math.floor(Math.random() * 1000) + 1 // 1 to 1000
  };
});

// Save to Algolia
index
  .saveObjects(records, { autoGenerateObjectIDIfNotExist: true })
  .then(() => {
    console.log(`Indexed ${records.length} records to Algolia`);
    return setFacetingSettings(index);
  })
  .then(() => {
    console.log(`Faceting settings applied`);
  })
  .catch(err => {
    console.error('Error during indexing or settings:', err);
  });

function setFacetingSettings(index) {
  return index.setSettings({
    attributesForFaceting: [
      'searchable(categoryPageId)',
      'categories',
      'language',
      'searchable(filters)',
    ]
  });
}