import { env } from '~~/server/utils/env'
import { logger } from '~~/server/utils/logger'

import { db } from './db'
import { AuthRepo } from './repositories/auth.repo'
import { CategoryRepo } from './repositories/category.repo'
import { CategoryDbRepo } from './repositories/categoryDb.repo'
import { GroupRepo } from './repositories/group.repo'
import { GroupDbRepo } from './repositories/groupDb.repo'
import { ProjectRepo } from './repositories/project.repo'
import { ProjectDbRepo } from './repositories/projectDb.repo'
import { ProjectS3Repo } from './repositories/projectS3.repo'
import { SessionRepo } from './repositories/session.repo'
import { UserRepo } from './repositories/user.repo'
import { s3 } from './utils/s3'

export const userRepo = new UserRepo()
export const projectDbRepo = new ProjectDbRepo(db)
export const projectS3Repo = new ProjectS3Repo(env.BUCKET_NAME, s3)

export const projectRepo = new ProjectRepo(projectDbRepo, projectS3Repo)

export const categoryDbRepo = new CategoryDbRepo(db)
export const categoryRepo = new CategoryRepo(categoryDbRepo, projectRepo)

export const groupDbRepo = new GroupDbRepo(db)
export const groupRepo = new GroupRepo(groupDbRepo, categoryRepo)

export const sessionRepo = new SessionRepo()
export const authRepo = new AuthRepo(userRepo, sessionRepo)
logger.log('di done')
