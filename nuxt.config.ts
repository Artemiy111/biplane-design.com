// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'

export default defineNuxtConfig({
  telemetry: { enabled: false },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-module-eslint-config',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@tresjs/nuxt',
    '@nuxtjs/partytown',
  ],
  googleFonts: {
    families: {
      Inter: true,
      Montserrat: true,
    },
  },
  app: { head: { htmlAttrs: { lang: 'ru' } } },
  eslintConfig: {
    setup: false,
  },
  shadcn: {
    componentDir: './components/ui',
    prefix: '',
  },
  imports: {
    dirs: [],
  },
  components: {
    dirs: [],
  },
  runtimeConfig: {
    supabaseUrl: '',
    supabaseKey: '',
    supabaseString: '',
    public: {
      blobReadWriteToken: '',
    },
  },
  build: {
    transpile: ['trpc-nuxt'],
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
