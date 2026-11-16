//------------------------------------------------------
// Sign a request with HMAC-SHA512 and verify it in constant time
// Run: HMAC_SECRET=$(openssl rand -base64 48) node hmac_signature.js
//------------------------------------------------------

import { createHmac, timingSafeEqual } from 'node:crypto';

const secretBase64 = process.env.HMAC_SECRET;
if (!secretBase64)
  throw new Error('Set HMAC_SECRET (base64), e.g. HMAC_SECRET=$(openssl rand -base64 48)');
const secret = Buffer.from(secretBase64, 'base64');

const sign = (path, timestamp) =>
  createHmac('sha512', secret).update(`${path}\n${timestamp}`).digest('base64');

const timestamp = Date.now();
const path = '/account/';
const signature = sign(path, timestamp);
console.log({ path, timestamp, signature });

// Receiver side: recompute and compare without leaking timing information
const verify = (path, timestamp, received) => {
  const expected = Buffer.from(sign(path, timestamp), 'base64');
  const actual = Buffer.from(received, 'base64');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
console.log('valid:', verify(path, timestamp, signature));
