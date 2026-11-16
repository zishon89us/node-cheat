//------------------------------------------------------
// Simple CLI calculator
// Run : node calculator.js add 2 3
//------------------------------------------------------

const operations = {
  add: (a, b) => a + b,
  sum: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => {
    if (b === 0) throw new RangeError('Division by zero');
    return a / b;
  },
};

export function calc(op1, op2, operation) {
  const fn = operations[operation];
  if (!fn) throw new TypeError(`Unknown operation "${operation}". Use: ${Object.keys(operations).join(', ')}`);
  if (!Number.isFinite(op1) || !Number.isFinite(op2)) throw new TypeError('Operands must be numbers');
  return fn(op1, op2);
}

if (import.meta.main ?? process.argv[1] === import.meta.filename) {
  const [operation, a, b] = process.argv.slice(2);
  try {
    console.log(calc(Number(a), Number(b), operation));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
