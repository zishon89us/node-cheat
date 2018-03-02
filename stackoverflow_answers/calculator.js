/**
 * Created by zeeshan on 3/2/2018.
 */

function calc (op1, op2, operation) {
	if (operation === 'sum' || operation === 'add'){
		return op1 + op2;
	}
	else if (operation === 'sub'){
		return op1 - op2;
	}
	else if (operation === 'mul'){
		return op1 * op2;
	}
	else if (operation === 'div'){
		return op1 / op2;
	}
	// expand here more operations if needed
	return 'Not sure what to do!';
}

var result = calc(Number(process.argv[3]), Number(process.argv[4]), process.argv[2]);

console.log(result);
