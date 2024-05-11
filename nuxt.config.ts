// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'

export default defineNuxtConfig({
  ssr: false,
  telemetry: { enabled: false },
  devtools: {
    enabled: false,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxtjs/supabase',
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
  components: {
    dirs: [],
  },
  runtimeConfig: {
    databaseUrl: '',
    supabaseUrl: '',
    supabaseKey: '',

    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    endpointUrl: '',
    region: '',
  },
  image: {
    ipx: {
    },
    format: ['avif', 'webp', 'png', 'jpg'],
  },
  supabase: {
    redirect: false,
  },
})
