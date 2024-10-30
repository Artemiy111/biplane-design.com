import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { projectRepo } from '~~/server/di'

export default defineSitemapEventHandler(async () => {
  const projects = await projectRepo.getAll()
  const projectsPage = asSitemapUrl({
    loc: 'https://biplane-design.com/projects',
    images: projects.filter(p => p.images.length).map(p => ({
      loc: p.images[0].url,
      title: p.images[0].alt,
      caption: p.images[0].alt,
    })),
  })
  const urls = projects.map(p => asSitemapUrl({
    loc: `https://biplane-design.com/projects/${p.uri}`,
    images: p.images.map(img => ({
      loc: img.url,
      title: img.alt,
      caption: img.alt,
    })),
  }))
  return [projectsPage, ...urls]
})
