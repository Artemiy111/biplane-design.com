// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'

export default defineNuxtConfig({
  ssr: true,
  telemetry: { enabled: false },
  devtools: {
    enabled: false,
    timeline: {
      enabled: true,
    },
  },
  future: {
    compatibilityVersion: 4,
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
    }, {
      name: 'Inter',
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
    sources: ['/api/__sitemap__/urls']
  },
  robots: {
    disallow: ['/admin/*'],
  },
  // yandexMetrika: {
  //   debug: false,
  //   id: '61819282',
  // },
})
