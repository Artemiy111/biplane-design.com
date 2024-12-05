// https://nuxt.com/docs/api/configuration/nuxt-config
// import oxlintPlugin from 'vite-plugin-oxlint'
// import eslintPlugin from 'vite-plugin-eslint'

import { env } from './server/shared/env'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/partytown',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    'shadcn-nuxt',
    // 'nuxt-yandex-metrika',
    '@tresjs/nuxt',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],

  imports: {
    dirs: [],
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  app: { head: { htmlAttrs: { lang: 'ru' } } },

  // yandexMetrika: {
  //   debug: false,
  //   id: '61819282',
  // },

  // components: {
  //   dirs: [],
  // },

  site: {
    url: 'https://biplane-design.com',
  },

  runtimeConfig: {
    BASE_URL: env.BASE_URL,
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    typedPages: true,
    // sharedPrerenderData: true,
    // componentIslands: true,
    // asyncContext: true,
  },

  compatibilityDate: '2024-07-20',
  telemetry: { enabled: false },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    families: [{
      name: 'Montserrat',
    }],
  },

  image: {
    format: ['avif', 'webp', 'png', 'jpg'],
    ipx: {
    },
  },

  robots: {
    disallow: ['/admin/*'],
  },

  shadcn: {
    componentDir: './src/shared/ui/kit',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  tailwindcss: {
    cssPath: '~~/src/shared/assets/css/tailwind.css',
  },

})
