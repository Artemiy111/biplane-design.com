import { db } from './db'

import { GetProjectUseCase } from './use-cases/get-project.use-case'
import { GetProjectByUriUseCase } from './use-cases/get-project-by-uri.use-case'
import { GetProjectsUseCase } from './use-cases/get-projects.use-case'
import { CreateProjectUseCase } from './use-cases/create-project.use-case'
import { UpdateProjectUseCase } from './use-cases/update-project.use-case'
import { DeleteProjectUseCase } from './use-cases/delete-project.use-case'

import { GetImageUseCase } from './use-cases/get-image.use-case'
import { GetImagesByProjectUriUseCase } from './use-cases/get-images-by-project-uri'
import { CreateImageUseCase } from './use-cases/create-image.use-case'
import { UpdateImageUseCase } from './use-cases/update-image.use-case'
import { DeleteImageUseCase } from './use-cases/delete-image.use-case'

import { GetCategoryUseCase } from './use-cases/get-category.use-case'
import { CreateCategoryUseCase } from './use-cases/create-category.use-case'
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case'
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case'

import { GetGroupUseCase } from './use-cases/get-group.use-case'
import { GetGroupsUseCase } from './use-cases/get-groups.use-case'
import { CreateGroupUseCase } from './use-cases/create-group.use-case'
import { UpdateGroupUseCase } from './use-cases/update-group.use-case'
import { DeleteGroupUseCase } from './use-cases/delete-group.use-case'

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
import { logger } from './shared/logger'
import { s3 } from './s3'
import { AuthRepo } from './infra/auth.repo'
import { env } from '~/server/shared/env'

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

// use-cases

export const getGroupUseCase = new GetGroupUseCase(groupRepo)
export const getGroupsUseCase = new GetGroupsUseCase(groupRepo)
export const createGroupUseCase = new CreateGroupUseCase(groupRepo)
export const updateGroupUseCase = new UpdateGroupUseCase(groupRepo)
export const deleteGroupUseCase = new DeleteGroupUseCase(groupRepo)

export const getCategoryUseCase = new GetCategoryUseCase(categoryRepo)
export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepo)
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo)

export const getProjectUseCase = new GetProjectUseCase(projectRepo)
export const getProjectByUriUseCase = new GetProjectByUriUseCase(projectRepo)
export const getProjectsUseCase = new GetProjectsUseCase(projectRepo)
export const createProjectUseCase = new CreateProjectUseCase(projectRepo)
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepo)
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo)

export const getImagesByProjectUriUseCase = new GetImagesByProjectUriUseCase(imageRepo)
export const getImageUseCase = new GetImageUseCase(imageRepo)
export const createImageUseCase = new CreateImageUseCase(imageRepo)
export const updateImageUseCase = new UpdateImageUseCase(imageRepo)
export const deleteImageUseCase = new DeleteImageUseCase(imageRepo)

logger.log('di phase done')
