import { asSitemapUrl, defineSitemapEventHandler } from '#sitemap/server'

import { projectRepo } from '~~/server/repositories'

export default defineSitemapEventHandler(async () => {
  const projects = await projectRepo.getAll()
  const projectsPage = asSitemapUrl({
    loc: 'https://biplane-design.com/projects',
    images: projects.flatMap((p) => {
      const image = p.images[0]
      return image ? [{ loc: image.url, title: image.alt, caption: image.alt }] : []
    }),
  })
  const urls = projects.map(p => asSitemapUrl({
    loc: `https://biplane-design.com/projects/${p.slug}`,
    images: p.images.map(img => ({
      loc: img.url,
      title: img.alt,
      caption: img.alt,
    })),
  }))
  return [projectsPage, ...urls]
})
