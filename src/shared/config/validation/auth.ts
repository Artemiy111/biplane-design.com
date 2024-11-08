import { z } from 'zod'

import { getMinMaxStringSchema, validationErrors } from './base'

const passwordSchema = getMinMaxStringSchema(6, 20)

export const loginSchema = z.object({
  username: getMinMaxStringSchema(3, 64),
  password: passwordSchema,
})

export type LoginDto = z.infer<typeof loginSchema>

const registerSchema = z.object({
  username: getMinMaxStringSchema(3, 64),
  password: passwordSchema,
  repeatPassword: passwordSchema,
}).refine(data => data.repeatPassword === data.password, {
  message: validationErrors.passwordsDoNotMatch,
  path: ['repeatPassword'],
})

export type RegisterDto = z.infer<typeof registerSchema>

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  repeatNewPassword: passwordSchema,
}).refine(data => data.newPassword === data.repeatNewPassword, {
  message: validationErrors.passwordsDoNotMatch,
  path: ['repeatNewPassword'],
})

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>

export const authSchemas = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
}
