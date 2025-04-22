const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Adds filters to ES-es boxes using all relevant Spanish filter CSVs

const processedDir = path.join(__dirname, '../data/processed');
const filtersDir = path.join(__dirname, '../data/raw/filters');
const filterFiles = [
  'box-filters-DAK-ES.csv',
  'box-filters-LAV-ES.csv',
  'box-filters-SBX-ES.csv'
].map(file => path.join(filtersDir, file));

// Group all filters by box ID
async function loadAllFilters() {
  const filtersByBox = {};

  for (const filePath of filterFiles) {
    await new Promise((resolve) => {
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
        .on('end', resolve);
    });
  }

  return filtersByBox;
}

// Attach filters to each ES-es box
async function enrichBoxesWithFiltersES() {
  const langKey = 'ES-es';
  const boxesPath = path.join(processedDir, `${langKey}.enriched.json`);
  const outputPath = path.join(processedDir, `${langKey}.final.json`);

  const boxes = JSON.parse(fs.readFileSync(boxesPath));
  const filters = await loadAllFilters();

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

enrichBoxesWithFiltersES();