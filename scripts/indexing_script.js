require('dotenv').config();
const fs = require('fs');
const algoliasearch = require('algoliasearch');
const camelCase = require('lodash.camelcase');

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
const rawRecords = JSON.parse(fs.readFileSync('data/processed/CH-fr.final.json', 'utf8'));
const records = rawRecords.map(camelCaseKeys);

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
      'categoryPageId',
      'categories',
      'language',
      'searchable(filters)',
    ]
  });
}