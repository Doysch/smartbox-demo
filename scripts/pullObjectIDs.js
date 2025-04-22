const algoliasearch = require('algoliasearch');
require('dotenv').config();


// Replace these with your actual credentials
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

async function run() {
  try {
    await index.browseObjects({
      query: '', // Empty query = get everything
      batch: batch => {
        batch.forEach(record => {
          if (record.objectID) {
            console.log(record.objectID);
          }
        });
      }
    });
  } catch (err) {
    console.error('Error while browsing index:', err);
  }
}

run();
