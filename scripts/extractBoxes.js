const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Generate a random price in ¢10 increments between 25–500
function getRandomPrice() {
  const steps = Array.from({ length: 48 }, (_, i) => (i + 3) * 10);
  return steps[Math.floor(Math.random() * steps.length)];
}

// read boxes.csv and extracts boxes for the CH market,
// split by language (fr, de, it), spit out as separate JSON files.

const inputPath = path.join(__dirname, '../data/raw/boxes.csv'); 
const outputPath = path.join(__dirname, '../data/processed/'); 

// set  languages t per country
const supportedMarkets = {
  Switzerland: ['French', 'German', 'Italian']
};

const langMap = {
  French: 'fr',
  German: 'de',
  Italian: 'it'
};

const output = {
  'CH-fr': [],
  'CH-de': [],
  'CH-it': []
};

// Read the CSV file and process each row
fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    const country = row['Box Country'];
    const lang = row['Language'];

    if (!lang) {
      console.warn(`Missing language for box ID: ${row['PIM Code']}`);
      return;
    }

    const langCode = langMap[lang.trim()];
    const key = `CH-${langCode}`;

    // only include CH in de, fr, it
    if (country === 'Switzerland' && output[key]) {
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

      output[key].push(row);
    } else if (country === 'Switzerland') {
      console.warn(`Unsupported language "${lang}" for Switzerland`);
    }
  })
  .on('end', () => {
    //  write each group to separaten file
    Object.entries(output).forEach(([key, records]) => {
      const filePath = path.join(outputPath, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
      console.log(`Wrote ${records.length} records to ${filePath}`);
    });
  });