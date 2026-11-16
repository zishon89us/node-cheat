// AWS Lambda (Node.js 22+ runtime, ESM): download two images, overlay one on the other with sharp, store the result in S3.
// Original question: https://stackoverflow.com/q/35846425
// Event: { "userProfileImagePath": "https://...", "friendProfileImagePath": "https://..." }
// Env: DEST_BUCKET. Deploy sharp built for linux (e.g. npm install --os=linux --cpu=arm64 sharp) or use a layer.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3 = new S3Client({});
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function downloadImage(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error(`Only https image URLs are allowed: ${url}`);

  const res = await fetch(parsed, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  if (!res.headers.get('content-type')?.startsWith('image/'))
    throw new Error(`Not an image: ${url}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error(`Image too large: ${url}`);
  return buffer;
}

export const handler = async (event) => {
  const bucket = process.env.DEST_BUCKET;
  if (!bucket) return { stat: 'error', msg: 'DEST_BUCKET is not configured' };

  const { userProfileImagePath, friendProfileImagePath } = event ?? {};
  if (!userProfileImagePath || !friendProfileImagePath) {
    return { stat: 'error', msg: 'userProfileImagePath and friendProfileImagePath are required' };
  }

  try {
    const [userImage, friendImage] = await Promise.all([
      downloadImage(userProfileImagePath),
      downloadImage(friendProfileImagePath),
    ]);

    const merged = await sharp(userImage)
      .resize(400, 400, { fit: 'cover' })
      .composite([
        { input: await sharp(friendImage).resize(200, 200).toBuffer(), top: 100, left: 100 },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();

    const key = `merged/${Date.now()}.jpg`;
    await s3.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: merged, ContentType: 'image/jpeg' }),
    );

    return { stat: 'ok', bucket, key };
  } catch (err) {
    console.error(err);
    return { stat: 'error', msg: 'Error manipulating the image' };
  }
};
