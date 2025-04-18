import type { ImageDb } from '../db/schema'
import type { ImageDto } from '../types'

export const imageMapper = {
  toDto(db: ImageDb, url: string): ImageDto {
    return {
      ...db,
      url: url,
    }
  },
}
