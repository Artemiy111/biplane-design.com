import { describe, expect, test } from 'bun:test'
import { ProjectFsRepo } from './projectFs.repo'

describe('projectFs.repo', () => {
  const repo = new ProjectFsRepo('/app')
  test('getProjectDir returns right path', () => {
    expect(repo.getDir('haha')).toEndWith('/app/haha')
  })
})
