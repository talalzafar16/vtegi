import type { S3ClientConfig } from '@aws-sdk/client-s3'

/**
 * File storage for uploads: Supabase Storage via its S3-compatible API.
 * Configured entirely by environment variables; empty S3_BUCKET means "use the local /media folder".
 */
export const s3Bucket = process.env.S3_BUCKET || ''

export const s3ClientConfig: S3ClientConfig = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  forcePathStyle: true, // required by Supabase Storage
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
}
