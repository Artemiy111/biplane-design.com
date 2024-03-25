import { describe, expect, test } from 'bun:test'
import { createProjectFsRepo } from './projectFs.repo'

describe('projectFs.repo', () => {
  const repo = createProjectFsRepo('/app')
  test('getProjectDir returns right path', () => {
    expect(repo.getProjectDir('haha')).toEndWith('/app/haha')
  })
})
