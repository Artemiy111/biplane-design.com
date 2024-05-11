import type { S3ServiceException, S3Client } from '@aws-sdk/client-s3'
import { HeadObjectCommand, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Result } from '../shared/result'
import { err, ok } from '../shared/result'
import type { IImageBucketRepo } from '../use-cases/types'

export class ImageS3Repo implements IImageBucketRepo {
  constructor(private bucketName: string, private s3: S3Client) { }

  getImageKey(projectUri: string, filename: string): string {
    return `${projectUri}/${filename}`
  }

  async isImageFileExist(projectUri: string, filename: string): Promise<Result<boolean, Error>> {
    const key = this.getImageKey(projectUri, filename)

    try {
      await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(true)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      if (error.name === 'NotFound') {
        return ok(false)
      }
      return err(new Error(`Error checking existence of image '${filename}' in project '${projectUri}': ${error.message}`))
    }
  }

  async getImageUrl(projectUri: string, filename: string): Promise<Result<string, Error>> {
    const key = this.getImageKey(projectUri, filename)

    try {
      const params = { Bucket: this.bucketName, Key: key }
      const url = await getSignedUrl(this.s3, new GetObjectCommand(params), { expiresIn: 3600 })
      return ok(url)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Could not get URL for image '${filename}' in project '${projectUri}': ${error.message}`))
    }
  }

  async createImageFile(projectUri: string, filename: string, data: Buffer): Promise<Result<void, Error>> {
    const key = this.getImageKey(projectUri, filename)

    try {
      await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key, Body: data }))
      return ok(undefined)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Could not create image '${filename}' in project '${projectUri}': ${error.message}`))
    }
  }

  async renameImageFile(projectUri: string, oldFilename: string, newFilename: string): Promise<Result<void, Error>> {
    const oldKey = this.getImageKey(projectUri, oldFilename)
    const newKey = this.getImageKey(projectUri, newFilename)

    try {
      await this.s3.send(new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${oldKey}`,
        Key: newKey,
      }))

      await this.s3.send(new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: oldKey,
      }))

      return ok(undefined)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Could not rename image '${oldFilename}' to '${newFilename}' in project '${projectUri}': ${error.message}`))
    }
  }

  async deleteImageFile(projectUri: string, filename: string): Promise<Result<void, Error>> {
    const key = this.getImageKey(projectUri, filename)

    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }))
      return ok(undefined)
    }
    catch (_e) {
      const error = _e as S3ServiceException
      return err(new Error(`Could not delete image '${filename}' in project '${projectUri}': ${error.message}`))
    }
  }
}
