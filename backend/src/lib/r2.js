import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 é compatível com a API S3. O endpoint usa o Account ID.
const accountId = process.env.R2_ACCOUNT_ID;

export const R2_BUCKET = process.env.R2_BUCKET_NAME || 'econao';
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
