//------------------------------------------------------
//Write Excel - from an specified column or row
//Web Link=> https://stackoverflow.com/questions/60358401/write-data-starting-from-a-specific-row-column-using-module-exceljs-with-node-js
//Run : node write_xlsx.js
//------------------------------------------------------

const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Node-Cheat');
// keep {} where you wan to skip the column
sheet.columns = [{}, {key: 'first', header: 'First'}, {}, {key: 'last', header: 'Last'}];
// keep {} where you wan to skip the row
const data = [{first:'John', last: 'Doe'}, {}, {first:'Jenny', last: 'Smith'}];

data.forEach((item, i) => {
  sheet.addRow(item);
});

workbook.xlsx.writeFile('node-cheat.xlsx').then(() => {
    console.log('Finished...');
});
