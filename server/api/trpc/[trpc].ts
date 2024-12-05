import { createNuxtApiHandler } from 'trpc-nuxt'

import { authRepo, categoryRepo, groupRepo, imageRepo, projectRepo, userRepo } from '~~/server/di'
import { authedProcedure, createContext, publicProcedure, router } from '~~/server/trpc/trpc'
import { authSchemas, categorySchemas, groupSchemas, imageSchemas, projectSchemas } from '~~/src/shared/config/validation'

export const appRouter = router({
  user: {
    whoami: publicProcedure.query(({ ctx }) => {
      return ctx.user
    }),
    changePassword: authedProcedure.input(authSchemas.changePasswordSchema).mutation(({ input, ctx }) => {
      return userRepo.changePassword(ctx.user.id, input.newPassword)
    }),
  },
  auth: {
    login: publicProcedure.input(authSchemas.loginSchema).mutation(async ({ input, ctx }) => {
      return authRepo.login(input, ctx.event)
    }),
    register: publicProcedure.input(authSchemas.registerSchema).mutation(async ({ input, ctx }) => {
      return authRepo.register(input, ctx.event)
    }),
    logout: authedProcedure.query(async ({ ctx }) => {
      return authRepo.logout(ctx.event, ctx.session.id)
    }),
  },

  groups: {
    getAll: publicProcedure.query(() => {
      return groupRepo.getAll()
    }),
    getOne: publicProcedure.input(groupSchemas.getOneSchema).query(({ input }) => {
      return groupRepo.getOne(input.id)
    }),
    createOne: authedProcedure.input(groupSchemas.createSchema).mutation(({ input }) => {
      return groupRepo.create(input)
    }),
    updateOne: authedProcedure.input(groupSchemas.updateSchema).mutation(({ input }) => {
      return groupRepo.update(input.id, input)
    }),
    deleteOne: authedProcedure.input(groupSchemas.updateSchema).mutation(({ input }) => {
      return groupRepo.delete(input.id)
    }),
  },

  categories: {
    getAll: publicProcedure.query(() => {
      return categoryRepo.getAll()
    }),
    getOne: publicProcedure.input(categorySchemas.getOneSchema).query(({ input }) => {
      return categoryRepo.getOne(input.id)
    }),
    createOne: authedProcedure.input(categorySchemas.createSchema).mutation(({ input }) => {
      return categoryRepo.create(input)
    }),
    updateOne: authedProcedure.input(categorySchemas.updateSchema).mutation(({ input }) => {
      return categoryRepo.update(input.id, input)
    }),
    deleteOne: authedProcedure.input(categorySchemas.deleteSchema).mutation(({ input }) => {
      return categoryRepo.delete(input.id)
    }),
  },

  projects: {
    getOne: publicProcedure.input(projectSchemas.getOneSchema).query(({ input }) => {
      return projectRepo.getOne(input.id)
    }),
    getOneBySlug: publicProcedure.input(projectSchemas.getOneBySlugSchema).query(({ input }) => {
      return projectRepo.getOneBySlug(input.slug)
    }),
    getAll: publicProcedure.query(() => {
      return projectRepo.getAll()
    }),
    createOne: authedProcedure.input(projectSchemas.createSchema).mutation(({ input }) => {
      return projectRepo.create(input)
    }),
    updateOne: authedProcedure.input(projectSchemas.updateSchema).mutation(({ input }) => {
      return projectRepo.update(input.id, input)
    }),
    updateOrder: authedProcedure.input(projectSchemas.updateOrderSchema).mutation(({ input }) => {
      return projectRepo.updateOrder(input.id, input.order)
    }),
    deleteOne: authedProcedure.input(projectSchemas.deleteSchema).mutation(({ input }) => {
      return projectRepo.delete(input.id)
    }),
  },

  images: {
    getOne: publicProcedure.input(imageSchemas.getOneSchema).query(({ input }) => {
      return imageRepo.getOne(input.id)
    }),
    createOne: authedProcedure.input(imageSchemas.createSchema).mutation(({ input }) => {
      return imageRepo.create(input)
    }),
    updateOne: authedProcedure.input(imageSchemas.updateSchema).mutation(({ input }) => {
      return imageRepo.update(input.id, input)
    }),
    deleteOne: authedProcedure.input(imageSchemas.deleteSchema).mutation(({ input }) => {
      return imageRepo.delete(input.id)
    }),
  },
})

export type AppRouter = typeof appRouter

export default createNuxtApiHandler({
  router: appRouter,
  createContext,
})
