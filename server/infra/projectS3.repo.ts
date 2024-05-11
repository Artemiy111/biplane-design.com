import { S3ServiceException, S3Client, HeadObjectCommand, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { err, ok, Result } from '../shared/result'
import { IProjectBucketRepo } from '../use-cases/types'

export class ProjectS3Repo implements IProjectBucketRepo {
  constructor(private bucketName: string, private s3: S3Client) { }

  async isDirExist(uri: string): Promise<Result<boolean, Error>> {
    const key = this.getDir(uri)

    try {
      await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(true)
    } catch (_e) {
      const error = _e as S3ServiceException
      if (error.name === 'NotFound') {
        return ok(false)
      }
      return err(new Error(`Error checking existence of directory ${uri}: ${error.message}`))
    }
  }

  getDir(uri: string) {
    return uri
  }

  async createDir(uri: string): Promise<Result<void, Error>> {
    const key = this.getDir(uri)

    if ((await this.isDirExist(uri)).ok) {
      return err(new Error(`Directory '${uri}' already exists`))
    }

    try {
      await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(undefined)
    } catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Error creating directory '${uri}': ${error.message}`))
    }
  }

  async renameDir(uri: string, newUri: string): Promise<Result<void, Error>> {
    if (uri === newUri) {
      return ok(undefined)
    }

    const oldKey = this.getDir(uri)
    const newKey = this.getDir(newUri)

    try {
      await this.s3.send(new CopyObjectCommand({ Bucket: this.bucketName, CopySource: `${this.bucketName}/${oldKey}`, Key: newKey }))
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: oldKey }))
      return ok(undefined)
    } catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Error renaming directory '${uri}' to '${newUri}': ${error.message}`))
    }
  }

  async deleteDir(uri: string): Promise<Result<void, Error>> {
    const key = await this.getDir(uri)

    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(undefined)
    } catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Error deleting directory '${uri}': ${error.message}`))
    }
  }
}