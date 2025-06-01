import { toast } from 'vue-sonner'

import type { ImageId, ProjectId } from '~~/server/db/schema'
import type { CreateProjectDto, UpdateImageDto, UpdateProjectDto } from '~~/server/types'
import { useApi } from '~~/src/shared/api'
import type { ChangePasswordDto, LoginDto, RegisterDto } from '~~/src/shared/config/validation/auth'

export const messages = {
  user: {
    login: {
      success: 'Вход выполнен',
      error: 'Не удалось войти в аккаунт',
    },
    register: {
      success: 'Аккаунт успешно создан',
      error: 'Не удалось создать аккаунт',
    },
    changePassword: {
      success: 'Пароль изменён',
      error: 'Не удaлось сменить пароль',
    },
  },
  project: {
    create: {
      success: 'Проект создан',
      error: 'Не удалось создать проект',
    },
    update: {
      success: 'Проект изменён',
      error: 'Не удалось изменить проект',
    },
    updateOrder: {
      error: 'Не удалось переместить проект',
    },
    delete: {
      success: 'Проект удалён',
      error: 'Не удалось удалить проект',
    },
  },
  image: {
    delete: {
      success: 'Изображение удалено',
      error: 'Не удалось удалить изображение',
    },
    update: {
      success: 'Изображение обновлено',
      error: 'Не удалось обновить изображение',
    },
  }
}

export const useCreateProjectMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: createProject, ...rest } = useMutation({
    mutation: async (dto: CreateProjectDto) => {
      return await useApi().projects.createOne.mutate(dto)
    },
    onSuccess: () => {
      toast.success(messages.project.create.success)
    },
    onError: () => {
      toast.error(messages.project.create.error)
    },
    onSettled: () => {
      qc.invalidateQueries({ key: ['projects'] })
    },
  })
  return { createProject, ...rest }
})

export const useUpdateProjectMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: updateProject, ...rest } = useMutation({
    mutation: ([id, dto]: [ProjectId, UpdateProjectDto]) => useApi().projects.updateOne.mutate({ ...dto, id }),
    onSuccess: () => {
      toast.success(messages.project.update.success)
    },
    onError: () => {
      toast.error(messages.project.update.error)
    },
    onSettled() {
      qc.invalidateQueries({ key: ['projects'] })
    },
  })

  return { updateProject, ...rest }
})

export const useUpdateProjectOrderMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: updateProjectOrder, ...rest } = useMutation({
    mutation: ([id, order]: [ProjectId, number]) => useApi().projects.updateOrder.mutate({ id, order }),
    onError: () => {
      toast.error(messages.project.updateOrder.error)
    },
    onSettled() {
      qc.invalidateQueries({ key: ['projects'] })
    },
  })

  return { updateProjectOrder, ...rest }
})

export const useDeleteProjectMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: deleteProject, ...rest } = useMutation({
    mutation: (id: ProjectId) => useApi().projects.deleteOne.mutate({ id }),
    onSuccess: () => {
      toast.success(messages.project.delete.success)
    },
    onError: () => {
      toast.error(messages.project.delete.error)
    },
    onSettled() {
      qc.invalidateQueries({ key: ['projects'] })
    },
  })

  return { deleteProject, ...rest }
})

export const useChangePasswordMutation = defineMutation(() => {
  const { mutateAsync: changePassword, ...rest } = useMutation({
    mutation: (dto: ChangePasswordDto) => useApi().user.changePassword.mutate(dto),
    onSuccess: () => {
      toast.success(messages.user.changePassword.success)
    },
    onError: () => {
      toast.error(messages.user.changePassword.error)
    },
    onSettled: () => {
      useQueryCache().invalidateQueries({ key: ['user'] })
    },
  })

  return { changePassword, ...rest }
})

export const useLoginMutation = defineMutation(() => {
  const qc = useQueryCache()
  const { mutateAsync: login, ...rest } = useMutation({
    mutation: (dto: LoginDto) => useApi().auth.login.mutate(dto),
    onSuccess: () => {
      toast.success(messages.user.login.success)
    },
    onError: () => {
      toast.error(messages.user.login.error)
    },
    onSettled: () => {
      qc.invalidateQueries({ key: ['user'] })
    },
  })

  return { login, ...rest }
})

export const useRegisterMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: register, ...rest } = useMutation({
    mutation: (dto: RegisterDto) => useApi().auth.register.mutate(dto),
    onSuccess: () => {
      toast.success(messages.user.register.success)
    },
    onError: () => {
      toast.error(messages.user.register.error)
    },
    onSettled: () => {
      qc.invalidateQueries({ key: ['user'] })
    },
  })

  return { register, ...rest }
})

export const useDeleteImageMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: deleteImage, ...rest } = useMutation({
    mutation: (id: ImageId) => useApi().images.deleteOne.mutate({ id }),
    onSuccess: () => {
      toast.success(messages.image.delete.success)
    },
    onError: () => {
      toast.error(messages.image.delete.error)
    },
    onSettled: () => {
      qc.invalidateQueries({ key: ['groups'] })
    },
  })
  return { deleteImage, ...rest }
})

export const useUpdateImageMutation = defineMutation(() => {
  const qc = useQueryCache()

  const { mutateAsync: updateImage, ...rest } = useMutation({
    mutation: (dto: UpdateImageDto) => useApi().images.updateOne.mutate(dto),
    onSuccess: () => {
      toast.success(messages.image.update.success)
    },
    onError: () => {
      toast.error(messages.image.update.error)
    },
    onSettled: () => {
      qc.invalidateQueries({ key: ['groups'] })
    },
  })

  return { updateImage, ...rest }
})

