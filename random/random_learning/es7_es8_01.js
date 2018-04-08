/**
 * Created by Zeeshan on 23/02/2018.
 */


//------------------------------------------------------
//Random learning thread ES7-ES8
//Web Link=>
//------------------------------------------------------

//------------------------------------------------------
//Topic: Array/String includes
//------------------------------------------------------

const { log } = console;
const separator = () => log('------------------') ;


const numberArray = [2018, 2019, 2020, 2030, NaN];
const randomArray1 = [undefined, ];
const randomArray2 = [null,];

/* Normal on Array */
log(numberArray.includes(2018)); // true
log(numberArray.includes(5050)); // false

/* Normal on Array from Index */
log(numberArray.includes(2018, 1)); // false

/* Normal on Array */
log(randomArray1.includes(undefined)); // true
log(randomArray1.includes(null)); // false
log(randomArray1.includes()); // true

/* Woah! what??? */
log(randomArray2.includes(undefined)); // false ..why if log(randomArray2[1]) is giving undefined as output
log(randomArray2.includes(null)); // true
log(randomArray2.includes()); // false

separator();
const randomString = 'Hey! I am node-cheat! cool yeah!!';

/* Normal on String */
log(randomString.includes('node-')); // true
log(randomString.includes('Hey', 1)); // false

//------------------------------------------------------
//Topic: Exponentiation Operator
//------------------------------------------------------
const cubed  = 7 ** 3;
let squared = 7;
squared **= 2;

log(cubed);
log(squared);

// const cubedOldStyle = Math.pow(2,3);
// log(cubedOldStyle);

//------------------------------------------------------
//Topic: Object.values/Object.entries
//------------------------------------------------------

const data = {'ES8': 2017, 'ES7': 2016, 'ES6': 2015};
log(Object.values(data));