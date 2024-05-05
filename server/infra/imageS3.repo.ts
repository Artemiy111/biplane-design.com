import type { IImageFsRepo } from '../use-cases/types'
import { type S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export class ImageS3Repo implements IImageFsRepo {
  constructor(private client: S3Client) {

  }

  async isImageFileExist(projectUri: string, filename: string) {
    const command = new GetObjectCommand({
      Bucket: 'biplane-design',
      Key: `${projectUri}/${filename}`,
    })
    const res = await this.client.send(command)
    console.log(res)
  }
}