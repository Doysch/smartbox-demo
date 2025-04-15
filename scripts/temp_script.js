const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const mappingPath = path.join(__dirname, '../data/raw/box_exp.csv');
let count = 0;

fs.createReadStream(mappingPath)
  .pipe(csv())
  .on('data', (row) => {
    if (row.BoxId === '942548') {
      count++;
    }
  })
  .on('end', () => {
    console.log(`Box 942548 has ${count} experiences mapped to it.`);
  });