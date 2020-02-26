//------------------------------------------------------
//Encrypt Decrypt - with crypto.createCipheriv and crypto.createDecipheriv respectively
//Web Link=> https://stackoverflow.com/questions/60369148/how-do-i-replace-deprecated-crypto-createcipher-in-nodejs/60370205?noredirect=1#comment106794846_60370205
//Run : node crypto-create-cipheriv.js
//------------------------------------------------------

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = 'Put_Your_Password_Here'; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;

function encrypt(text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
	let textParts = text.split(':');
	let iv = Buffer.from(textParts.shift(), 'hex');
	let encryptedText = Buffer.from(textParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

let a = encrypt('node-cheat');
let b = decrypt(a);
console.log(a, b);