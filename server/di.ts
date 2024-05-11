import path from 'node:path'
import { S3Client } from '@aws-sdk/client-s3'
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

import { ProjectFsRepo } from './infra/projectFs.repo'
import { UserRepo } from './infra/user.repo'
import { GroupDbRepo } from './infra/groupDb.repo'
import { ProjectRepo } from './infra/project.repo'
import { ProjectDbRepo } from './infra/projectDb.repo'
import { ImageDbRepo } from './infra/imageDb.repo'
import { ImageRepo } from './infra/image.repo'
import { ImageFsRepo } from './infra/imageFs.repo'
import { CategoryDbRepo } from './infra/categoryDb.repo'
import { ImageS3Repo } from './infra/imageS3.repo'
import { ProjectS3Repo } from './infra/projectS3.repo'
import { CategoryRepo } from './infra/category.repo'
import { GroupRepo } from './infra/group.repo'

const PROJECTS_DIR = path.join(`/public/images/projects`)

const s3 = new S3Client()

export const userRepo = new UserRepo()

export const projectDbRepo = new ProjectDbRepo(db)
export const projectS3Repo = new ProjectS3Repo('biplane-design', s3)
export const projectFsRepo = new ProjectFsRepo(PROJECTS_DIR)

export const imageDbRepo = new ImageDbRepo(db)
export const imageFsRepo = new ImageFsRepo(projectFsRepo)
export const imageS3Repo = new ImageS3Repo('biplane-design', s3)
export const imageRepo = new ImageRepo(imageDbRepo, imageS3Repo, projectDbRepo)

export const projectRepo = new ProjectRepo(projectDbRepo, projectFsRepo, imageRepo)

export const categoryDbRepo = new CategoryDbRepo(db)
export const categoryRepo = new CategoryRepo(categoryDbRepo, projectRepo)

export const groupDbRepo = new GroupDbRepo(db)
export const groupRepo = new GroupRepo(groupDbRepo, categoryRepo)
// use-cases

export const getGroupUseCase = new GetGroupUseCase(groupRepo)
export const getGroupsUseCase = new GetGroupsUseCase(groupRepo)
export const createGroupUseCase = new CreateGroupUseCase(groupRepo, userRepo)
export const updateGroupUseCase = new UpdateGroupUseCase(groupRepo, userRepo)
export const deleteGroupUseCase = new DeleteGroupUseCase(groupRepo, userRepo)

export const getCategoryUseCase = new GetCategoryUseCase(categoryRepo)
export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo, userRepo)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepo, userRepo)
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo, userRepo)

export const getProjectUseCase = new GetProjectUseCase(projectRepo)
export const getProjectByUriUseCase = new GetProjectByUriUseCase(projectRepo)
export const getProjectsUseCase = new GetProjectsUseCase(projectRepo)
export const createProjectUseCase = new CreateProjectUseCase(projectRepo, userRepo)
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepo, userRepo)
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo, userRepo)

export const getImagesByProjectUriUseCase = new GetImagesByProjectUriUseCase(imageRepo)
export const getImageUseCase = new GetImageUseCase(imageRepo)
export const createImageUseCase = new CreateImageUseCase(imageRepo, userRepo)
export const updateImageUseCase = new UpdateImageUseCase(imageRepo, userRepo)
export const deleteImageUseCase = new DeleteImageUseCase(imageRepo, userRepo)
