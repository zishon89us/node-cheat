//------------------------------------------------------
// Alfred Script Filter: fuzzy-search rows of a Google Sheet and return Alfred JSON
// Web Link=> https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
// Run: GOOGLE_API_KEY=... node alfred_workflow.js <sheetId> <keyword>
//------------------------------------------------------

import { GoogleSpreadsheet } from 'google-spreadsheet';
import fuzzy from 'fuzzy';

const [sheetId, keyword = ''] = process.argv.slice(2);
if (!sheetId) throw new Error('Usage: node alfred_workflow.js <sheetId> <keyword>');
if (!process.env.GOOGLE_API_KEY) throw new Error('Set GOOGLE_API_KEY (the sheet must be shared publicly)');

const doc = new GoogleSpreadsheet(sheetId, { apiKey: process.env.GOOGLE_API_KEY });
await doc.loadInfo();
const rows = await doc.sheetsByIndex[0].getRows();

// Columns used by the original sheet: shorthand, links, notes, keyword
const matches = fuzzy.filter(keyword, rows, { extract: (row) => row.get('shorthand') ?? '' });

const items = matches.map(({ original: row }) => ({
  title: row.get('notes'),
  subtitle: row.get('links'),
  arg: row.get('links'),
  autocomplete: row.get('keyword'),
  valid: true,
}));

// Alfred reads this JSON from stdout
process.stdout.write(JSON.stringify({ items }));
