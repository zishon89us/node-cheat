/**
 * Created by Zeeshan on 3/4/2016.
 */

var cc = require('coupon-code');

//------------------------------------------------------
//Create coupon/promo/voucher codes of different length
//Web Link=>
//------------------------------------------------------


//code of length 4 with 3 parts, looks like DEEM-Y68E-RM81
var one = cc.generate();

console.log(one);
//console.log(cc.validate(one));


//code of length 6 with 1 part, looks like 7HTY4Q
var two = cc.generate({ parts : 1, partLen :6 });

console.log(two);
//console.log(cc.validate(two, { parts : 1, partLen :6 }))


//cc.generate({ parts : 4 });
