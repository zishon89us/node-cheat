
//------------------------------------------------------
//Error Handling - minimal ways to handle js error within nodejs
//Web Link=> https://stackoverflow.com/questions/60247774/how-to-avoid-node-js-app-quit-when-theres-a-javascript-error/60248024#60248024
//Run : node error-handling.js
//------------------------------------------------------

// Option 1
try {
  // trying to do something that might fail should be inside try block
	let max_weight = 17, min_weight = 5;
	max_weight = Match.floor(max_weight/min_weight);
} catch(err) {
  console.log(err); // do something with error or ignore it
}


// Option 2
// process.on('uncaughtException', function(err) {
//   console.log(err); // do something with error or ignore it
// });
//
// let max_weight = 17, min_weight = 5;
// max_weight = Match.floor(max_weight / min_weight);
