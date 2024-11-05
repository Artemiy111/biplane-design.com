import { env } from '~~/server/shared/env'
import { logger } from '~~/server/shared/logger'

import { db } from './db'
import { AuthRepo } from './repositories/auth.repo'
import { CategoryRepo } from './repositories/category.repo'
import { CategoryDbRepo } from './repositories/categoryDb.repo'
import { GroupRepo } from './repositories/group.repo'
import { GroupDbRepo } from './repositories/groupDb.repo'
import { ImageRepo } from './repositories/image.repo'
import { ImageDbRepo } from './repositories/imageDb.repo'
import { ImageS3Repo } from './repositories/imageS3.repo'
import { ProjectRepo } from './repositories/project.repo'
import { ProjectDbRepo } from './repositories/projectDb.repo'
import { ProjectS3Repo } from './repositories/projectS3.repo'
import { UserRepo } from './repositories/user.repo'
import { s3 } from './s3'

export const authRepo = new AuthRepo()
export const userRepo = new UserRepo()
export const projectDbRepo = new ProjectDbRepo(db)
export const projectS3Repo = new ProjectS3Repo(env.BUCKET_NAME, s3)

export const imageDbRepo = new ImageDbRepo(db)
export const imageS3Repo = new ImageS3Repo(env.BUCKET_NAME, s3)
export const imageRepo = new ImageRepo(imageDbRepo, imageS3Repo)

export const projectRepo = new ProjectRepo(projectDbRepo, projectS3Repo, imageRepo)

export const categoryDbRepo = new CategoryDbRepo(db)
export const categoryRepo = new CategoryRepo(categoryDbRepo, projectRepo)

export const groupDbRepo = new GroupDbRepo(db)
export const groupRepo = new GroupRepo(groupDbRepo, categoryRepo)

logger.log('di done')
