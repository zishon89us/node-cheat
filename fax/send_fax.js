// Send a fax through the Telnyx Programmable Fax API using global fetch.
// Run: TELNYX_API_KEY=KEY... TELNYX_FAX_CONNECTION_ID=... TELNYX_FAX_FROM=+15550001111 \
//      node send_fax.js +15551234567 https://example.com/document.pdf

const { TELNYX_API_KEY, TELNYX_FAX_CONNECTION_ID, TELNYX_FAX_FROM } = process.env;
if (!TELNYX_API_KEY || !TELNYX_FAX_CONNECTION_ID || !TELNYX_FAX_FROM) {
  throw new Error('Set TELNYX_API_KEY, TELNYX_FAX_CONNECTION_ID and TELNYX_FAX_FROM');
}

const [to, mediaUrl] = process.argv.slice(2);
if (!/^\+[1-9]\d{6,14}$/.test(to ?? '') || !mediaUrl?.startsWith('https://')) {
  throw new Error('Usage: node send_fax.js <E.164 number> <https URL of a PDF>');
}

const res = await fetch('https://api.telnyx.com/v2/faxes', {
  method: 'POST',
  headers: { Authorization: `Bearer ${TELNYX_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ connection_id: TELNYX_FAX_CONNECTION_ID, from: TELNYX_FAX_FROM, to, media_url: mediaUrl }),
  signal: AbortSignal.timeout(15_000),
});

const payload = await res.json();
if (!res.ok) throw new Error(`Fax request failed (${res.status}): ${JSON.stringify(payload.errors ?? payload)}`);
console.log(`Fax ${payload.data.id} queued, status: ${payload.data.status}`);
