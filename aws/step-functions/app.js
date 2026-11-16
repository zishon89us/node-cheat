// Start an AWS Step Functions execution and wait for it to finish (AWS SDK v3).
// Run: AWS_REGION=us-east-1 STATE_MACHINE_ARN=arn:aws:states:... node app.js '{"orderId": 42}'
// Background: https://aws.amazon.com/step-functions/

import { setTimeout as sleep } from 'node:timers/promises';
import { SFNClient, StartExecutionCommand, DescribeExecutionCommand } from '@aws-sdk/client-sfn';

const stateMachineArn = process.env.STATE_MACHINE_ARN;
if (!stateMachineArn) throw new Error('Set STATE_MACHINE_ARN to the state machine to run');

const input = process.argv[2] ?? '{}';
JSON.parse(input); // fail early on invalid JSON

const sfn = new SFNClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const { executionArn } = await sfn.send(new StartExecutionCommand({ stateMachineArn, input }));
console.log('Started', executionArn);

let execution;
do {
  await sleep(2000);
  execution = await sfn.send(new DescribeExecutionCommand({ executionArn }));
  console.log('Status:', execution.status);
} while (execution.status === 'RUNNING');

console.log(execution.status === 'SUCCEEDED' ? JSON.parse(execution.output ?? 'null') : execution.cause);
