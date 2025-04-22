const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// This script adds filters to each box using localized filter CSVs

const processedDir = path.join(__dirname, '../data/processed');
const filtersDir = path.join(__dirname, '../data/raw/filters');

const filterFiles = {
    'CH-fr': path.join(filtersDir, 'box-filters-SBX-CH-fr.csv'),
    'CH-de': path.join(filtersDir, 'box-filters-SBX-CH-de.csv'),
    'CH-it': path.join(filtersDir, 'box-filters-SBX-CH-it.csv')
  };

// Step 1: Load filters from CSV into an object grouped by box ID
function loadFilters(filePath) {
  return new Promise((resolve) => {
    const filtersByBox = {};
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const boxId = row.box_id;
        const name = row.box_filter_name;
        const value = row.box_filter_value;

        if (!filtersByBox[boxId]) filtersByBox[boxId] = {};
        if (!filtersByBox[boxId][name]) filtersByBox[boxId][name] = [];
        if (!filtersByBox[boxId][name].includes(value)) {
          filtersByBox[boxId][name].push(value);
        }
      })
      .on('end', () => {
        resolve(filtersByBox);
      });
  });
}

// Step 2: Attach filters to each box
async function enrichBoxesWithFilters(langKey) {
  const boxesPath = path.join(processedDir, `${langKey}.enriched.json`);
  const outputPath = path.join(processedDir, `${langKey}.final.json`);
  const filterPath = filterFiles[langKey];

  const boxes = JSON.parse(fs.readFileSync(boxesPath));
  const filters = await loadFilters(filterPath);

  const updated = boxes.map(box => {
    const boxId = box['PIM Code'];
    return {
      ...box,
      filters: filters[boxId] || {}
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2));
  console.log(`Wrote final enriched file with filters: ${outputPath}`);
}

// Run it for each locale
['CH-fr', 'CH-de', 'CH-it'].forEach(enrichBoxesWithFilters);