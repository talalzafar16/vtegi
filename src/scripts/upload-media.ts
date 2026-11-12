// One-time copy of local /media uploads to S3 storage (same filenames, safe to re-run).
// Run after adding the S3_* variables: yarn media:upload
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import config from '@payload-config'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import { s3Bucket, s3ClientConfig } from '@/lib/s3'

if (!s3Bucket || !process.env.S3_ENDPOINT || !process.env.S3_ACCESS_KEY_ID) {
  throw new Error('Set the S3_* variables in .env first (see .env.example).')
}

const s3 = new S3Client(s3ClientConfig)
const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[media upload] ${msg}`)

const alreadyUploaded = (key: string) =>
  s3.send(new HeadObjectCommand({ Bucket: s3Bucket, Key: key })).then(
    () => true,
    () => false,
  )

const { docs } = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
let uploaded = 0
let skipped = 0
let missing = 0

for (const doc of docs) {
  if (!doc.filename) continue
  if (await alreadyUploaded(doc.filename)) {
    skipped++
    continue
  }
  const localFile = path.resolve('media', doc.filename)
  if (!existsSync(localFile)) {
    missing++
    log(`missing locally, skipped: ${doc.filename}`)
    continue
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: doc.filename,
      Body: readFileSync(localFile),
      ContentType: doc.mimeType ?? undefined,
    }),
  )
  uploaded++
}

log(`done: ${uploaded} uploaded, ${skipped} already there, ${missing} missing locally`)
process.exit(0)
