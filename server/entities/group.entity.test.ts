import { describe, expect, test } from 'bun:test'
import { GroupEntity } from './group.entity'

describe('GroupEntity', () => {
  test('should pass', () => {
    const group = new GroupEntity({
      title: 'Архитектура',
      uri: 'arch',
      order: 1,
      categories: [],
    })
    expect(group.title).toBe('Архитектура')
  })

  test('should validate title', () => {
    expect(
      () =>
        new GroupEntity({
          title: 'А',
          uri: 'arch',
          order: 1,
          categories: [],
        }),
    ).toThrow()
  })

  test('should validate uri', () => {
    expect(
      () =>
        new GroupEntity({
          title: 'Архитектура',
          uri: 'a r c h',
          order: 1,
          categories: [],
        }),
    ).toThrow()
  })

  test('should validate order', () => {
    expect(
      () =>
        new GroupEntity({
          title: 'Архитектура',
          uri: 'architecture',
          order: 0,
          categories: [],
        }),
    ).toThrow()
  })
})
