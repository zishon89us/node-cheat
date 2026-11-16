//------------------------------------------------------
// Error handling - keep a Node.js app alive when JS errors happen
// Web Link=> https://stackoverflow.com/questions/60247774/how-to-avoid-node-js-app-quit-when-theres-a-javascript-error/60248024#60248024
// Run : node error-handling.js
//------------------------------------------------------

// Option 1: synchronous try/catch
try {
  const maxWeight = 17;
  const minWeight = 5;
  // eslint-disable-next-line no-undef
  console.log(Match.floor(maxWeight / minWeight)); // typo on purpose: Match -> Math
} catch (err) {
  console.error('Caught sync error:', err.message);
}

// Option 2: async/await with try/catch
async function mightFail() {
  throw new Error('async failure');
}
try {
  await mightFail();
} catch (err) {
  console.error('Caught async error:', err.message);
}

// Option 3: last-resort process handlers - log, then exit; state may be corrupt
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exitCode = 1;
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  process.exit(1);
});
