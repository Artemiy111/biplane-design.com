import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

import type { ProjectId } from '../db/schema'
import { s3 } from '../utils/s3'
import { env } from '../utils/env'

class ProjectS3Repo {
  getKey(id: ProjectId): string {
    return `${id}/`
  }

  async deleteDir(id: ProjectId): Promise<void> {
    const key = this.getKey(id)
    const listObjectsResponse = await s3.send(new ListObjectsV2Command({ Bucket: env.BUCKET_NAME, Prefix: key }))

    if (listObjectsResponse.Contents) {
      const deletePromises = listObjectsResponse.Contents.map(async (object) => {
        const deleteParams = {
          Bucket: env.BUCKET_NAME,
          Key: object.Key!,
        }
        await s3.send(new DeleteObjectCommand(deleteParams))
      })

      await Promise.all(deletePromises)
    }
  }
}

export const projectS3Repo = new ProjectS3Repo()