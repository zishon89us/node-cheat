//------------------------------------------------------
//Duration - find duration between two given dates in special format
//Web Link=> https://stackoverflow.com/questions/60349611/calculate-time-differences-in-nodejs-from-a-manually-created-format/60350332#60350332
//Run : node duration.js
//------------------------------------------------------

const moment = require('moment');

const yourSpecialFormat = 'YYYY-MM-DD-HH-mm-ss';
const someDateInYourFormat = '2020-02-22-05-58-57';

let now = moment(moment().format(yourSpecialFormat), yourSpecialFormat);
let then = moment(someDateInYourFormat, yourSpecialFormat);

console.log('Hours   ----> ', moment.duration(now.diff(then)).asHours());
console.log('Minutes ----> ', moment.duration(now.diff(then)).asMinutes ());
