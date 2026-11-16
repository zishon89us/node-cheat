// Duration between now and a date in a custom format (YYYY-MM-DD-HH-mm-ss), no date library needed
// Web Link=> https://stackoverflow.com/questions/60349611
// Run: node day/duration.js

const parseCustom = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Expected YYYY-MM-DD-HH-mm-ss, got "${value}"`);
  const [, y, mo, d, h, mi, s] = match.map(Number);
  return new Date(y, mo - 1, d, h, mi, s);
};

const then = parseCustom('2020-02-22-05-58-57');
const diffMs = Date.now() - then.getTime();

console.log('Hours   ---->', diffMs / 3_600_000);
console.log('Minutes ---->', diffMs / 60_000);

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
console.log('Relative ---->', rtf.format(-Math.round(diffMs / 86_400_000), 'day'));
