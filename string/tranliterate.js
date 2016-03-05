/**
 * Created by Zeeshan on 3/5/2016.
 */

var tr = require('transliteration');
var slugify = require('transliteration').slugify;
//------------------------------------
// replacement attempt
tr("0xAE, 0xFEFF"); // ®
tr("0xA9, 0xFEFF"); // ©
tr("0x2122, 0xFEFF"); // ™
//------------------------------------
//very beginning
console.log(tr("ABC ©"));
//Output: ABC (c)

var test1 = "ABC®: 123©"

var regex = /\((r)\)|\((c)\)/g;
//remove what you want
test1 = tr(test1).replace(regex,'');

console.log(test1);
//Output: ABC: 123

//now sluggify
console.log(slugify(test1, { lowercase: true, separator: '-' }));
//Output: abc-123
//------------------------------------
var test2 = "®ABC: 123©";
var test3 = "A®BC: 12©3";
//console.log(slugify(test2, { lowercase: true, separator: '-' }));
//console.log(slugify(test3, { lowercase: true, separator: '-' }));
