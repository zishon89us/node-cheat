/**
 * Created by Zeeshan on 23/02/2018.
 */


//------------------------------------------------------
//Random learning thread ES7-ES8
//Web Link=>
//------------------------------------------------------

const { log } = console;


const numberArray = [2018, 2019, 2020, 2030, NaN];
const StringArray = ['Node', 'Cheat', 'Jane', 'Node'];
const randomArray1 = [undefined, ];
const randomArray2 = [null,];


log(numberArray.includes(2018)); // true
log(numberArray.includes(5050)); // false

log(randomArray1.includes(undefined)); // true
log(randomArray1.includes(null)); // false
log(randomArray1.includes()); // true
log(randomArray2.includes(undefined)); // false
log(randomArray2.includes(null)); // true
log(randomArray2.includes()); // false
