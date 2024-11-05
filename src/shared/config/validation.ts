import { z } from 'zod'

const formatter = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short' })

export const validationErrors = {
  required: 'Это обязательное поле',
  email: 'Неверный формат электронной почты',
  minLength: (min: number) => `Длина должна быть не менее ${min}`,
  maxLength: (max: number) => `Длина должна быть не более ${max}`,
  pattern: 'Значение не соответствует шаблону',
  minValue: (min: number) => `Значение должно быть не менее ${min}`,
  maxValue: (max: number) => `Значение должно быть не более ${max}`,
  minDate: (min: Date) => `Дата должна быть не раньше ${formatter.format(min)}`,
  maxDate: (max: Date) => `Дата должна быть не позже ${formatter.format(max)}`,
  passwordsNotMatch: 'Пароли не совпадают',
  invalidPhoneNumber: 'Неверный номер телефона',
  passwordsDoNotMatch: 'Пароли не совпадают',
}

export const requiredStringSchema = z.string({ message: validationErrors.required })
export const requiredNumberSchema = z.number({ message: validationErrors.required })

export const getMinMaxStringSchema = (min: number, max: number) => requiredStringSchema.min(min, validationErrors.minLength(min)).max(max, validationErrors.maxLength(max))
export const getMinMaxNumberSchema = (min: number, max: number) => requiredNumberSchema.min(min, validationErrors.minValue(min)).max(max, validationErrors.maxValue(max))

export const passwordSchema = getMinMaxStringSchema(6, 20)

export const loginSchema = z.object({
  username: getMinMaxStringSchema(3, 64),
  password: passwordSchema,
})

export type LoginDto = z.infer<typeof loginSchema>

export const registerSchema = z.object({
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

const dateSchema = z
  .coerce.date({
    errorMap: () => ({
      message: validationErrors.required,
    }),
  })
  .min(new Date('1900-01-01'), validationErrors.minDate(new Date('1900-01-01')))
  .max(new Date(), validationErrors.maxDate(new Date()))
