import { httpBatchLink } from '@trpc/client'
import { createTRPCNuxtClient } from 'trpc-nuxt/client'

import type { AppRouter } from '~~/server/api/trpc/[trpc]'
import type { CreateGroupDto, CreateProjectDto, UpdateGroupDto, UpdateProjectDto } from '~~/server/use-cases/types'
import type { ChangePasswordDto, LoginDto, RegisterDto } from '~~/src/shared/config/validation/auth'

// import { api } from './instance'

// const authApi = {
//   login: (dto: LoginDto) => api('/api/auth/login', { body: dto, method: 'POST' }),
//   register: (dto: RegisterDto) => api('/api/auth/register', { body: dto, method: 'POST' }),
//   logout: () => api('/api/auth/logout'),
// }

// const userApi = {
//   get: () => api('/api/user'),
//   changePassword: (dto: ChangePasswordDto) => api('/api/user/change-password', { body: dto, method: 'POST' }),
// }

// const groupsApi = {
//   getAll: () => api('/api/groups/get-all'),
//   getById: (id: number) => api(`/api/groups/${id}/get`),
//   create: (dto: CreateGroupDto) => api('/api/groups/create-one', { body: dto, method: 'POST' }),
//   update: (id: number, dto: UpdateGroupDto) => api(`/api/groups/${id}/update`, { body: dto, method: 'POST' }),
//   delete: (id: number) => api(`/api/groups/${id}/delete`, { method: 'POST' }),
// }

// const categoriesApi = {
//   // getAll: () => api('/api/categories/get-all'),
//   getById: (id: number) => api(`/api/categories/${id}/get`),
//   create: (dto: CreateProjectDto) => api('/api/categories/create-one', { body: dto, method: 'POST' }),
//   update: (id: number, dto: UpdateProjectDto) => api(`/api/categories/${id}/update`, { body: dto, method: 'POST' }),
//   delete: (id: number) => api(`/api/categories/${id}/delete`, { method: 'POST' }),
// }

// const projectsApi = {
//   getAll: () => api('/api/projects/get-all'),
//   getByUri: (uri: string) => api('/api/projects/get-by-uri', { body: { uri }, method: 'POST' }),
//   create: (dto: CreateProjectDto) => api('/api/projects/create-one', { body: dto, method: 'POST' }),
//   update: (id: number, dto: UpdateProjectDto) => api(`/api/projects/${id}/update`, { body: dto, method: 'POST' }),
//   updateOrder: (id: number, order: number) => api(`/api/projects/${id}/update-order`, { body: { order }, method: 'POST' }),
//   delete: (id: number) => api(`/api/projects/${id}/delete`, { method: 'POST' }),
// }

// export const imagesApi = {
//   // getAll: () => api('/api/images/get-all'),
//   getById: (id: number) => api(`/api/images/${id}/get`),
//   create: (dto: CreateProjectDto) => api('/api/images/create-one', { body: dto, method: 'POST' }),
//   update: (id: number, dto: UpdateProjectDto) => api(`/api/images/${id}/update`, { body: dto, method: 'POST' }),
//   delete: (id: number) => api(`/api/images/${id}/delete`, { method: 'POST' }),
// }

// const apiAll = {
//   auth: authApi,
//   user: userApi,
//   projects: projectsApi,
//   groups: groupsApi,
//   categories: categoriesApi,
// }

// export { apiAll as api }

export const useApi = () => {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers: useRequestHeaders(),
      }),
    ],
  })
  return client
}
