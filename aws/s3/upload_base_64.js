// Upload base64 (or data: URL) content to S3 with AWS SDK v3.
// Run: AWS_REGION=us-east-1 S3_BUCKET=my-bucket node upload_base_64.js

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' });

export async function uploadBase64({ bucket, key, data, contentType }) {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(data);
  const body = Buffer.from(match ? match[2] : data, 'base64');

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType ?? match?.[1] ?? 'application/octet-stream',
    }),
  );
  return { bucket, key, size: body.length };
}

if (import.meta.main) {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error('Set S3_BUCKET to run this example');
  const onePixelPng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  console.log(await uploadBase64({ bucket, key: 'pixel.png', data: onePixelPng }));
}
