import type { S3Client, S3ServiceException } from '@aws-sdk/client-s3'

import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

import { env } from '~~/server/shared/env'

import type { ProjectId } from '../db/schema'

export class ImageS3Repo {
  constructor(private bucketName: string, private s3: S3Client) { }

  getKey(projectId: ProjectId, filename: string): string {
    return `${projectId}/${filename}`
  }

  getUrl(projectId: ProjectId, filename: string) {
    const key = this.getKey(projectId, filename)
    return env.ENDPOINT_URL + '/' + this.bucketName + '/' + key
  }

  async isImageFileExist(projectId: ProjectId, filename: string) {
    const key = this.getKey(projectId, filename)

    try {
      await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
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
    await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }))
  }

  async deleteImageFile(projectId: ProjectId, filename: string) {
    const key = this.getKey(projectId, filename)
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }))
  }
}
