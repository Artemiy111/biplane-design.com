// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'

export default defineNuxtConfig({
  ssr: false,
  telemetry: { enabled: false },
  devtools: {
    enabled: true,
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
    '@scalar/nuxt',
  ],
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
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
  components: {
    dirs: [],
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpointUrl: process.env.ENDPOINT_URL,
    region: process.env.REGION,
  },
  image: {
    ipx: {
    },
    format: ['avif', 'webp', 'png', 'jpg'],
  },
})
