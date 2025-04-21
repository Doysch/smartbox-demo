const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Generate a random price in ¢10 increments between 25–500
function getRandomPrice() {
  const steps = Array.from({ length: 48 }, (_, i) => (i + 3) * 10);
  return steps[Math.floor(Math.random() * steps.length)];
}

const inputPath = path.join(__dirname, '../data/raw/boxes.csv');
const outputPath = path.join(__dirname, '../data/processed/ES-es.json');

const results = [];

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    const country = row['Box Country'];
    const lang = row['Language'];

    if (country === 'Spain' && lang === 'Spanish') {
      const universe = row['Box Universe']?.trim();
      const subUniverse = row['Box Sub Universe']?.trim();

      row.price = getRandomPrice();

      if (universe) {
        row.categoryPageId = [universe];
        row.categories = { lvl0: universe };

        if (subUniverse) {
          row.categoryPageId.push(`${universe} > ${subUniverse}`);
          row.categories.lvl1 = `${universe} > ${subUniverse}`;
        }
      }

      results.push(row);
    }
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Wrote ${results.length} Spanish records to ${outputPath}`);
  });