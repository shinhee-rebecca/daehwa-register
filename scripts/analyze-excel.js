const XLSX = require('xlsx');

const workbook = XLSX.readFile('2512.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

console.log('Total rows:', jsonData.length);
console.log('\nFirst 5 rows:');
console.log(JSON.stringify(jsonData.slice(0, 5), null, 2));

console.log('\nColumn headers:');
if (jsonData.length > 0) {
  console.log(Object.keys(jsonData[0]));
}

console.log('\nAll data:');
console.log(JSON.stringify(jsonData, null, 2));
