require('dotenv').config();
const fs = require('fs');
const algoliasearch = require('algoliasearch');

// Setup Algolia client
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

// Load records from local JSON file
const records = JSON.parse(fs.readFileSync('data/processed/CH-fr.final.json', 'utf8'));

// Save records to Algolia
index
  .saveObjects(records, { autoGenerateObjectIDIfNotExist: true })
  .then(() => {
    console.log(`Indexed ${records.length} records to Algolia`);

    // After indexing, apply settings
    return setFacetingSettings(index);
  })
  .then(() => {
    console.log(`Faceting settings applied`);
  })
  .catch(err => {
    console.error('Error during indexing or settings:', err);
  });

// Function to set faceting settings
function setFacetingSettings(index) {
  return index.setSettings({
    attributesForFaceting: [
      'categoryPageId',
      'categories.lvl0',
      'categories.lvl1',
      'searchable(Box Brand)',
      'Language',
      'searchable(Box Country)'
    ]
  });
}