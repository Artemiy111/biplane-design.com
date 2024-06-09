import type { S3ServiceException, S3Client } from '@aws-sdk/client-s3'
import { HeadObjectCommand, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import type { Result } from '../shared/result'
import { err, ok } from '../shared/result'

export class ProjectS3Repo {
  constructor(private bucketName: string, private s3: S3Client) { }

  async isDirExists(uri: string): Promise<Result<boolean, Error>> {
    const key = this.getKey(uri)

    try {
      const _res = await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(true)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      if (error.name === 'NotFound') {
        return ok(false)
      }
      return err(new Error(error.message))
    }
  }

  getKey(uri: string) {
    return `${uri}/`
  }

  async createDir(uri: string): Promise<Result<void, Error>> {
    const key = this.getKey(uri)

    const isDirExists = await this.isDirExists(uri)
    if (!isDirExists.ok) return isDirExists

    if (isDirExists.value)
      return err(new Error(`Directory '${uri}' already exists`))

    try {
      await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(undefined)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Error creating directory '${uri}': ${error.message}`))
    }
  }

  async renameDir(uri: string, newUri: string): Promise<Result<void, Error>> {
    if (uri === newUri) {
      return ok(undefined)
    }

    const oldKey = this.getKey(uri)
    const newKey = this.getKey(newUri)

    try {
      await this.s3.send(new CopyObjectCommand({ Bucket: this.bucketName, CopySource: `${this.bucketName}/${oldKey}`, Key: newKey }))
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: oldKey }))
      return ok(undefined)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Error renaming directory '${uri}' to '${newUri}': ${error.message}`))
    }
  }

  async deleteDir(uri: string): Promise<Result<void, Error>> {
    const key = this.getKey(uri)
    const listObjectsResponse = await this.s3.send(new ListObjectsV2Command({ Bucket: this.bucketName, Prefix: key }))

    try {
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

      return ok(undefined)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Error deleting directory '${uri}': ${error.message}`))
    }
  }
}
