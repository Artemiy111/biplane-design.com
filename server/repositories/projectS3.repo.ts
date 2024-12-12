import type { S3Client } from '@aws-sdk/client-s3'

import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

import type { ProjectId } from '../db/schema'

export class ProjectS3Repo {
  constructor(private bucketName: string, private s3: S3Client) { }

  getKey(id: ProjectId): string {
    return `${id}/`
  }

  async deleteDir(id: ProjectId): Promise<void> {
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
