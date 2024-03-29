import path from 'node:path'
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case'
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case'
import { db } from './db'

import { GetProjectUseCase } from './use-cases/get-project.use-case'
import { GetProjectByUriUseCase } from './use-cases/get-project-by-uri.use-case'
import { GetProjectsUseCase } from './use-cases/get-projects.use-case'
import { CreateProjectUseCase } from './use-cases/create-project.use-case'
import { UpdateProjectUseCase } from './use-cases/update-project.use-case'
import { DeleteProjectUseCase } from './use-cases/delete-project.use-case'

import { GetImageUseCase } from './use-cases/get-image.use-case'
import { GetImagesByProjectUriUseCase } from './use-cases/get-images-by-project-uri'

import { GetCategoryUseCase } from './use-cases/get-category.use-case'
import { CreateCategoryUseCase } from './use-cases/create-category.use-case'

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

const PROJECTS_DIR = path.join(`/public/images/projects`)

export const userRepo = new UserRepo()

export const groupDbRepo = new GroupDbRepo(db)
export const categoryDbRepo = new CategoryDbRepo(db)

export const projectDbRepo = new ProjectDbRepo(db)
export const projectFsRepo = new ProjectFsRepo(PROJECTS_DIR)
export const projectRepo = new ProjectRepo(projectDbRepo, projectFsRepo)

const imageDbRepo = new ImageDbRepo(db)
const imageFsRepo = new ImageFsRepo(projectFsRepo)
const imageRepo = new ImageRepo(imageDbRepo, imageFsRepo)

export const getGroupUseCase = new GetGroupUseCase(groupDbRepo)
export const getGroupsUseCase = new GetGroupsUseCase(groupDbRepo)
export const createGroupUseCase = new CreateGroupUseCase(groupDbRepo, userRepo)
export const updateGroupUseCase = new UpdateGroupUseCase(groupDbRepo, userRepo)
export const deleteGroupUseCase = new DeleteGroupUseCase(groupDbRepo, userRepo)

export const getCategoryUseCase = new GetCategoryUseCase(categoryDbRepo)
export const createCategoryUseCase = new CreateCategoryUseCase(categoryDbRepo, userRepo)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryDbRepo, userRepo)
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryDbRepo, userRepo)

export const getProjectUseCase = new GetProjectUseCase(projectRepo)
export const getProjectByUriUseCase = new GetProjectByUriUseCase(projectRepo)
export const getProjectsUseCase = new GetProjectsUseCase(projectRepo)
export const createProjectUseCase = new CreateProjectUseCase(projectRepo, userRepo)
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepo, userRepo)
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo, userRepo)

export const getImagesByProjectUriUseCase = new GetImagesByProjectUriUseCase(imageRepo)
export const getImageUseCase = new GetImageUseCase(imageRepo)
