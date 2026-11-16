//------------------------------------------------------
// Read a public Google Sheet and print its rows
// Web Link=> https://theoephraim.github.io/node-google-spreadsheet
// Run: GOOGLE_API_KEY=... node google_sheets.js [sheetId]
//------------------------------------------------------

import { GoogleSpreadsheet } from 'google-spreadsheet';

if (!process.env.GOOGLE_API_KEY) throw new Error('Set GOOGLE_API_KEY (Sheets API enabled)');

// API-key access works only for sheets shared as "anyone with the link"; use a service account for private ones
const sheetId = process.argv[2] ?? '1OmqePbgblBhWjTmsW3xmIZjx0ZIZRuzOuxxtvBluTlM';
const doc = new GoogleSpreadsheet(sheetId, { apiKey: process.env.GOOGLE_API_KEY });

await doc.loadInfo();
console.log(`Sheet: ${doc.title}`);

const rows = await doc.sheetsByIndex[0].getRows();
for (const row of rows) {
  console.log(row.get('city'), row.get('country'));
}
