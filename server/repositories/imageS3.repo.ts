import type { S3ServiceException } from '@aws-sdk/client-s3'
import { s3 } from '~~/server/utils/s3'
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

import { env } from '~~/server/utils/env'

import type { ProjectId } from '../db/schema'

class ImageS3Repo {
  getKey(projectId: ProjectId, filename: string): string {
    return `${projectId}/${filename}`
  }

  getUrl(projectId: ProjectId, filename: string) {
    const key = this.getKey(projectId, filename)
    return env.ENDPOINT_URL + '/' + env.BUCKET_NAME + '/' + key
  }

  async isImageFileExist(projectId: ProjectId, filename: string) {
    const key = this.getKey(projectId, filename)

    try {
      await s3.send(new HeadObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }))
      return true
    }
    catch (_e) {
      const error = _e as S3ServiceException
      if (error.name === 'NotFound') {
        return false
      }
      return new Error(`Error checking existence of image '${filename}' in project '${projectId}': ${error.message}`)
    }
  }

  async createImageFile(projectId: ProjectId, filename: string, file: File) {
    const key = this.getKey(projectId, filename)
    await s3.send(new PutObjectCommand({ Bucket: env.BUCKET_NAME, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }))
  }

  async deleteImageFile(projectId: ProjectId, filename: string) {
    const key = this.getKey(projectId, filename)
    await s3.send(new DeleteObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }))
  }
}

export const imageS3Repo = new ImageS3Repo()