//------------------------------------------------------
// Find exchange rates i.e. USD to GBP etc...
// Web Link=> https://openexchangerates.org
// Run: OPENEXCHANGERATES_APP_ID=... node exchange_rates.js
//------------------------------------------------------

const appId = process.env.OPENEXCHANGERATES_APP_ID;
if (!appId) throw new Error('Set OPENEXCHANGERATES_APP_ID');

const url = new URL('https://openexchangerates.org/api/latest.json');
url.searchParams.set('app_id', appId);

const response = await fetch(url);
if (!response.ok) throw new Error(`Exchange rate request failed: ${response.status}`);

const { base, rates } = await response.json();
console.log(`1 ${base} = ${rates.GBP} GBP`);
console.log(rates);
