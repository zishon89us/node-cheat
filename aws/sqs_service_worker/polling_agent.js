// SQS long-polling worker with AWS SDK v3: receive, process, delete. Ctrl+C stops it cleanly.
// Run: AWS_REGION=us-east-1 SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123/my-queue node polling_agent.js

import { SQSClient, ReceiveMessageCommand, DeleteMessageBatchCommand } from '@aws-sdk/client-sqs';

const QueueUrl = process.env.SQS_QUEUE_URL;
if (!QueueUrl) throw new Error('Set SQS_QUEUE_URL to the queue to poll');

const sqs = new SQSClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const stop = new AbortController();
process.once('SIGINT', () => stop.abort());

async function processMessage(message) {
  console.log('Processing', message.MessageId, message.Body);
}

while (!stop.signal.aborted) {
  try {
    const { Messages = [] } = await sqs.send(
      new ReceiveMessageCommand({
        QueueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 60,
      }),
      { abortSignal: stop.signal },
    );
    if (Messages.length === 0) continue;

    const results = await Promise.allSettled(Messages.map(processMessage));
    // Only delete what succeeded; failures reappear after the visibility timeout.
    const done = Messages.filter((_, i) => results[i].status === 'fulfilled');
    if (done.length) {
      await sqs.send(
        new DeleteMessageBatchCommand({
          QueueUrl,
          Entries: done.map(({ MessageId, ReceiptHandle }) => ({ Id: MessageId, ReceiptHandle })),
        }),
      );
    }
    console.log(`Handled ${done.length}/${Messages.length} messages`);
  } catch (err) {
    if (stop.signal.aborted) break;
    console.error('Poll failed, retrying in 5s:', err.message);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
console.log('Worker stopped');
