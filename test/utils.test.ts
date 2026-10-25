import { describe, expect, test } from 'bun:test'

import { cn } from '../src/shared/lib/utils/cn'
import { getSlug } from '../src/shared/lib/utils/get-slug'

describe('getSlug', () => {
  test('transliterates cyrillic titles', () => {
    expect(getSlug('Агидель Бальзам')).toBe('agidel-balzam')
  })

  test('lowercases and trims latin titles', () => {
    expect(getSlug('  Vatrushkin Loft  ')).toBe('vatrushkin-loft')
  })

  test('keeps digits and removes punctuation', () => {
    expect(getSlug('Дом 101Б, офис 313')).toBe('dom-101b-ofis-313')
  })
})

describe('cn', () => {
  test('merges conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  test('drops falsy values and keeps the rest', () => {
    expect(cn('flex', undefined, false && 'hidden', 'gap-2')).toBe('flex gap-2')
  })
})
