// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'
// import oxlintPlugin from 'vite-plugin-oxlint'
// import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
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
    '@pinia/nuxt',
  ],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  tailwindcss: {
    cssPath: '~~/src/shared/assets/css/tailwind.css',
  },

  ssr: true,
  runtimeConfig: {},

  app: { head: { htmlAttrs: { lang: 'ru' } } },

  fonts: {
    families: [{
      name: 'Montserrat',
    }],
  },

  shadcn: {
    componentDir: './components/ui',
    prefix: '',
  },

  image: {
    format: ['avif', 'webp', 'png', 'jpg'],
    ipx: {
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  imports: {
    dirs: [],
  },

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

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    disallow: ['/admin/*'],
  },

  telemetry: { enabled: false },
  compatibilityDate: '2024-07-20',

})