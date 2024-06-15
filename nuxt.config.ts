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
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/partytown',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@tresjs/nuxt',
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
})
