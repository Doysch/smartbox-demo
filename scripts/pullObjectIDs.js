const algoliasearch = require('algoliasearch');

// Replace these with your actual credentials
const APPLICATION_ID = 'YourApplicationID';
const ADMIN_API_KEY = 'YourAdminAPIKey';
const INDEX_NAME = 'your_index_name';

const client = algoliasearch('OA5TOH2VFB', '1307bdf251dda94acafc6c97072d4144');
const index = client.initIndex('smartbox_boxes_CH-fr');

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