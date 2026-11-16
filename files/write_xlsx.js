//------------------------------------------------------
// Write Excel - starting from a specific column or row
// Web Link=> https://stackoverflow.com/questions/60358401/write-data-starting-from-a-specific-row-column-using-module-exceljs-with-node-js
// Run: node write_xlsx.js
//------------------------------------------------------

import ExcelJS from 'exceljs';
import path from 'node:path';

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Node-Cheat');

// keep {} where you want to skip a column
sheet.columns = [{}, { key: 'first', header: 'First' }, {}, { key: 'last', header: 'Last' }];

// keep {} where you want to skip a row
const data = [{ first: 'John', last: 'Doe' }, {}, { first: 'Jenny', last: 'Smith' }];
sheet.addRows(data);

const output = path.join(import.meta.dirname, 'node-cheat.xlsx');
await workbook.xlsx.writeFile(output);
console.log(`Finished: ${output}`);
