//------------------------------------------------------
// Generate key pairs with node:crypto (no node-rsa needed)
// Web Link=> https://nodejs.org/api/crypto.html#cryptogeneratekeypairtype-options-callback
// Run: node generate_privatekey.js
//------------------------------------------------------

import { generateKeyPair, createSign, createVerify } from 'node:crypto';
import { promisify } from 'node:util';

const generateKeyPairAsync = promisify(generateKeyPair);

// RSA, PEM-encoded
const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
  modulusLength: 3072,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
console.log(publicKey);

// Ed25519: smaller, faster keys; prefer it for new signing use cases
const ed = await generateKeyPairAsync('ed25519');

// Sign + verify with the RSA pair
const signature = createSign('sha256').update('node-cheat').sign(privateKey, 'base64');
const valid = createVerify('sha256').update('node-cheat').verify(publicKey, signature, 'base64');
console.log('RSA signature valid:', valid);
console.log('Ed25519 public key:', ed.publicKey.export({ type: 'spki', format: 'pem' }));

// Never commit private keys. Store them in a secrets manager or a file outside the repo.
