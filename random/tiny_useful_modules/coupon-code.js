//------------------------------------------------------
// Create coupon/promo/voucher codes of different lengths
// Web Link=> https://github.com/appsattic/node-coupon-code
// Run: node coupon-code.js
//------------------------------------------------------

import cc from 'coupon-code';
import { randomInt } from 'node:crypto';

// 3 parts of 4 chars, with check digits, e.g. DEEM-Y68E-RM81
console.log(cc.generate());

// 1 part of 6 chars, e.g. 7HTY4Q
console.log(cc.generate({ parts: 1, partLen: 6 }));

// 3 parts of 3 chars, e.g. 2WR-TLU-K4N
console.log(cc.generate({ parts: 3, partLen: 3 }));

// validate() normalises user input (case, O/0, I/1 confusion) and verifies check digits
console.log(cc.validate('deem-y68e-rm81'));

// No dependency: cryptographically secure code from an unambiguous alphabet
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const secureCode = (length = 10) =>
  Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
console.log(secureCode());
