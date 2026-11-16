//------------------------------------------------------
// Guess gender from a first name (genderize.io, no key needed for low volume)
// and from first + last name (NamSor v2, needs NAMSOR_API_KEY)
// Run: node gender_by_name.js
//------------------------------------------------------

const firstName = 'Zeeshan';
const lastName = 'Memon';

const genderize = new URL('https://api.genderize.io/');
genderize.searchParams.set('name', firstName);

const genderizeRes = await fetch(genderize);
if (!genderizeRes.ok) throw new Error(`genderize.io failed: ${genderizeRes.status}`);
console.log('genderize response:', await genderizeRes.json());

if (process.env.NAMSOR_API_KEY) {
  const namsorUrl = `https://v2.namsor.com/NamSorAPIv2/api2/json/gender/${encodeURIComponent(firstName)}/${encodeURIComponent(lastName)}`;
  const namsorRes = await fetch(namsorUrl, {
    headers: { 'X-API-KEY': process.env.NAMSOR_API_KEY },
  });
  if (!namsorRes.ok) throw new Error(`NamSor failed: ${namsorRes.status}`);
  console.log('namsor response:', await namsorRes.json());
} else {
  console.log('Set NAMSOR_API_KEY to also query NamSor with first + last name.');
}
