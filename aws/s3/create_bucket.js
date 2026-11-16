// S3 bucket CRUD with AWS SDK v3: create bucket, put object, list buckets, delete object, delete bucket.
// Run: AWS_REGION=us-east-1 node create_bucket.js my-unique-bucket-name
// Credentials come from the default provider chain (env vars, ~/.aws/credentials, SSO, IAM role). Never hardcode them.

import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListBucketsCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  waitUntilBucketExists,
} from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION ?? 'us-east-1';
const Bucket = process.argv[2];
if (!Bucket) throw new Error('Usage: node create_bucket.js <bucket-name>');

const s3 = new S3Client({ region });

// us-east-1 rejects an explicit LocationConstraint; every other region requires one.
await s3.send(
  new CreateBucketCommand({
    Bucket,
    ...(region === 'us-east-1'
      ? {}
      : { CreateBucketConfiguration: { LocationConstraint: region } }),
  }),
);
await waitUntilBucketExists({ client: s3, maxWaitTime: 60 }, { Bucket });
console.log(`Created ${Bucket}`);

const Key = 'this_is_key';
await s3.send(
  new PutObjectCommand({ Bucket, Key, Body: 'This is data.', ContentType: 'text/plain' }),
);
console.log(`Uploaded ${Key}`);

const { Buckets = [] } = await s3.send(new ListBucketsCommand({}));
for (const { Name, CreationDate } of Buckets)
  console.log('Bucket:', Name, CreationDate?.toISOString());

// A bucket must be empty before it can be deleted.
await s3.send(new DeleteObjectCommand({ Bucket, Key }));
await s3.send(new DeleteBucketCommand({ Bucket }));
console.log(`Deleted ${Bucket}`);
