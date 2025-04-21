const algoliasearch = require('algoliasearch');

const client = algoliasearch('OA5TOH2VFB', '1307bdf251dda94acafc6c97072d4144');
const index = client.initIndex('smartbox_boxes_CH-fr');

async function run() {
  try {
    await index.browseObjects({
      query: '', // Empty query = get everything
      filters: 'filters.occasions:Anniversaire', // ✅ Directly here
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