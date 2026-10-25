import { describe, expect, test } from 'bun:test'

import { authSchemas, imageSchemas, projectSchemas } from '../src/shared/config/validation'

const project = {
  categoryId: 1,
  title: 'Тестовый проект',
  slug: 'testovyy-proekt',
  status: 'завершён',
  location: 'Москва',
} as const

describe('auth schemas', () => {
  test('accepts valid login credentials', () => {
    expect(authSchemas.loginSchema.safeParse({ username: 'admin', password: 'secret1' }).success).toBe(true)
  })

  test('rejects a password shorter than six characters', () => {
    const result = authSchemas.loginSchema.safeParse({ username: 'admin', password: '123' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Длина должна быть не менее 6')
    }
  })

  test('rejects mismatched registration passwords', () => {
    const result = authSchemas.registerSchema.safeParse({
      username: 'admin',
      password: 'secret1',
      repeatPassword: 'secret2',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(expect.objectContaining({
        message: 'Пароли не совпадают',
        path: ['repeatPassword'],
      }))
    }
  })

  test('accepts matching registration passwords', () => {
    expect(authSchemas.registerSchema.safeParse({
      username: 'admin',
      password: 'secret1',
      repeatPassword: 'secret1',
    }).success).toBe(true)
  })
})

describe('project schemas', () => {
  test('accepts a project and applies defaults', () => {
    const result = projectSchemas.createSchema.parse(project)

    expect(result.yearStart).toBeNull()
    expect(result.yearEnd).toBeNull()
    expect(result.isMinimal).toBe(false)
    expect(result.isVisible).toBe(true)
  })

  test('rejects a non-encoded slug', () => {
    const result = projectSchemas.createSchema.safeParse({ ...project, slug: 'тестовый проект' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Невалидный slug')
    }
  })

  test('enforces the supported year range', () => {
    const tooEarly = projectSchemas.createSchema.safeParse({ ...project, yearStart: 1999 })
    const tooLate = projectSchemas.createSchema.safeParse({ ...project, yearEnd: 2051 })

    expect(tooEarly.success).toBe(false)
    expect(tooLate.success).toBe(false)
    if (!tooEarly.success) {
      expect(tooEarly.error.issues[0]?.message).toBe('Год должен быть не менее 2000')
    }
    if (!tooLate.success) {
      expect(tooLate.error.issues[0]?.message).toBe('Год должен быть не более 2050')
    }
  })
})

describe('image schemas', () => {
  test('accepts a valid fit', () => {
    expect(imageSchemas.updateSchema.safeParse({
      alt: 'Фасад',
      fit: 'object-cover',
      id: '1',
      order: 1,
    }).success).toBe(true)
  })

  test('rejects an unknown fit', () => {
    expect(imageSchemas.updateSchema.safeParse({
      alt: 'Фасад',
      fit: 'object-random',
      id: '1',
      order: 1,
    }).success).toBe(false)
  })
})
