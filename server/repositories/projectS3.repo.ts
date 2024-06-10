import type { S3ServiceException, S3Client } from '@aws-sdk/client-s3'
import { HeadObjectCommand, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

export class ProjectS3Repo {
  constructor(private bucketName: string, private s3: S3Client) { }

  async isDirExists(uri: string) {
    const key = this.getKey(uri)

    try {
      const _res = await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
      return true
    }
    catch (_e) {
      const error = _e as S3ServiceException
      if (error.name === 'NotFound') {
        return false
      }
      throw _e
    }
  }

  getKey(uri: string) {
    return `${uri}/`
  }

  async createDir(uri: string) {
    const key = this.getKey(uri)
    const isDirExists = await this.isDirExists(uri)

    if (isDirExists)
      throw new Error(`Directory '${uri}' already exists`)

    await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key }))
  }

  async renameDir(uri: string, newUri: string) {
    if (uri === newUri) {
      return
    }

    const oldKey = this.getKey(uri)
    const newKey = this.getKey(newUri)

    await this.s3.send(new CopyObjectCommand({ Bucket: this.bucketName, CopySource: `${this.bucketName}/${oldKey}`, Key: newKey }))
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: oldKey }))
  }

  async deleteDir(uri: string) {
    const key = this.getKey(uri)
    const listObjectsResponse = await this.s3.send(new ListObjectsV2Command({ Bucket: this.bucketName, Prefix: key }))

    if (listObjectsResponse.Contents) {
      const deletePromises = listObjectsResponse.Contents.map(async (object) => {
        const deleteParams = {
          Bucket: this.bucketName,
          Key: object.Key!,
        }
        await this.s3.send(new DeleteObjectCommand(deleteParams))
      })

      await Promise.all(deletePromises)
    }
  }
}
