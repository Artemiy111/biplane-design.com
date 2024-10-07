// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'
import oxlintPlugin from 'vite-plugin-oxlint'
import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  ssr: true,
  telemetry: { enabled: false },

  devtools: {
    enabled: false,
    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/partytown',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    'shadcn-nuxt',
    // 'nuxt-yandex-metrika',
    '@tresjs/nuxt',
    '@nuxtjs/seo',
  ],

  // style
  fonts: {
    families: [{
      name: 'Montserrat',
    }],
  },

  shadcn: {
    componentDir: './components/ui',
    prefix: '',
  },

  //
  eslint: {
    config: {
      stylistic: true,
    },
  },

  app: { head: { htmlAttrs: { lang: 'ru' } } },

  imports: {
    dirs: [],
  },

  // components: {
  //   dirs: [],
  // },

  runtimeConfig: {
  },

  image: {
    ipx: {
    },
    format: ['avif', 'webp', 'png', 'jpg'],
  },

  site: {
    url: 'https://biplane-design.com',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  // yandexMetrika: {
  //   debug: false,
  //   id: '61819282',
  // },
  robots: {
    disallow: ['/admin/*'],
  },
  compatibilityDate: '2024-07-20',
})
