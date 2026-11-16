//------------------------------------------------------
// Encrypt / decrypt with authenticated AES-256-GCM (replacement for deprecated crypto.createCipher)
// Web Link=> https://stackoverflow.com/questions/60369148/how-do-i-replace-deprecated-crypto-createcipher-in-nodejs/60370205
// Run : ENCRYPTION_PASSWORD='long random passphrase' node crypto-create-cipheriv.js
//------------------------------------------------------

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

const password = process.env.ENCRYPTION_PASSWORD;
if (!password) {
  console.error('Set ENCRYPTION_PASSWORD to run this example.');
  process.exit(1);
}

const deriveKey = (salt) => scryptSync(password, salt, 32);

export function encrypt(plaintext) {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, deriveKey(salt), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return [salt, iv, cipher.getAuthTag(), ciphertext].map((b) => b.toString('base64url')).join('.');
}

export function decrypt(payload) {
  const [salt, iv, tag, ciphertext] = payload.split('.').map((p) => Buffer.from(p, 'base64url'));
  const decipher = createDecipheriv(ALGORITHM, deriveKey(salt), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

const encrypted = encrypt('node-cheat');
console.log({ encrypted, decrypted: decrypt(encrypted) });
