const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the input .xlsx file
const inputFilePath = path.resolve(__dirname, 'boxes.xlsx');

// Load the workbook
const workbook = XLSX.readFile(inputFilePath);

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get the worksheet
const worksheet = workbook.Sheets[sheetName];

// Convert worksheet to CSV
const csvData = XLSX.utils.sheet_to_csv(worksheet);

// Path for output CSV file
const outputFilePath = path.resolve(__dirname, 'boxes.csv');

// Save the CSV
fs.writeFileSync(outputFilePath, csvData);

console.log(`✅ Converted ${sheetName} to output.csv`);