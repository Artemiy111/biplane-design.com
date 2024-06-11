import type { S3Client } from '@aws-sdk/client-s3'
import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import type { ProjectId } from '../db/schema'

export class ProjectS3Repo {
  constructor(private bucketName: string, private s3: S3Client) { }

  // async isDirExists(id: ProjectId) {
  //   const key = this.getKey(id)

  //   try {
  //     const _res = await this.s3.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: key }))
  //     return true
  //   }
  //   catch (_e) {
  //     const error = _e as S3ServiceException
  //     if (error.name === 'NotFound') {
  //       return false
  //     }
  //     throw _e
  //   }
  // }

  getKey(id: ProjectId) {
    return `${id}/`
  }

  // async createDir(id: ProjectId) {
  //   const key = this.getKey(id)
  //   const isDirExists = await this.isDirExists(id)

  //   if (isDirExists)
  //     throw new Error(`Directory '${id}' already exists`)

  //   await this.s3.send(new PutObjectCommand({ Bucket: this.bucketName, Key: key }))
  // }

  async deleteDir(id: ProjectId) {
    const key = this.getKey(id)
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
