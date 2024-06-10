import type { S3ServiceException, S3Client } from '@aws-sdk/client-s3'
import { HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '~/server/shared/env'

export class ImageS3Repo {
  constructor(private bucketName: string, private s3: S3Client) { }

  getKey(projectUri: string, filename: string): string {
    return `${projectUri}/${filename}`
  }

  getUrl(projectUri: string, filename: string) {
    const key = this.getKey(projectUri, filename)
    return env.ENDPOINT_URL + '/' + this.bucketName + '/' + key
  }

  async isImageFileExist(projectUri: string, filename: string) {
    const key = this.getKey(projectUri, filename)

    try {
      await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
      return true
    }
    catch (_e) {
      const error = _e as S3ServiceException
      if (error.name === 'NotFound') {
        return false
      }
      return new Error(`Error checking existence of image '${filename}' in project '${projectUri}': ${error.message}`)
    }
  }

  async createImageFile(projectUri: string, filename: string, data: Buffer) {
    const key = this.getKey(projectUri, filename)
    const mimeType = 'image/' + filename.split('.').at(-1)
    await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key, Body: data, ContentType: mimeType }))
  }

  async deleteImageFile(projectUri: string, filename: string) {
    const key = this.getKey(projectUri, filename)
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }))
  }
}
