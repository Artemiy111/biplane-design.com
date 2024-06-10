import { db } from './db'
import { s3 } from './s3'

import { UserRepo } from './infra/user.repo'
import { GroupDbRepo } from './infra/groupDb.repo'
import { ProjectRepo } from './infra/project.repo'
import { ProjectDbRepo } from './infra/projectDb.repo'
import { ImageDbRepo } from './infra/imageDb.repo'
import { ImageRepo } from './infra/image.repo'
import { CategoryDbRepo } from './infra/categoryDb.repo'
import { ImageS3Repo } from './infra/imageS3.repo'
import { ProjectS3Repo } from './infra/projectS3.repo'
import { CategoryRepo } from './infra/category.repo'
import { GroupRepo } from './infra/group.repo'
import { AuthRepo } from './infra/auth.repo'

import { env } from '~/server/shared/env'
import { logger } from '~/server/shared/logger'

export const authRepo = new AuthRepo()
export const userRepo = new UserRepo()
export const projectDbRepo = new ProjectDbRepo(db)
export const projectS3Repo = new ProjectS3Repo(env.BUCKET_NAME, s3)

export const imageDbRepo = new ImageDbRepo(db)
export const imageS3Repo = new ImageS3Repo(env.BUCKET_NAME, s3)
export const imageRepo = new ImageRepo(imageDbRepo, imageS3Repo, projectDbRepo)

export const projectRepo = new ProjectRepo(projectDbRepo, projectS3Repo, imageRepo)

export const categoryDbRepo = new CategoryDbRepo(db)
export const categoryRepo = new CategoryRepo(categoryDbRepo, projectRepo)

export const groupDbRepo = new GroupDbRepo(db)
export const groupRepo = new GroupRepo(groupDbRepo, categoryRepo)

logger.log('di phase done')
