// https://nuxt.com/docs/api/configuration/nuxt-config
import '@total-typescript/ts-reset'

export default defineNuxtConfig({
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
    '@nuxtjs/google-fonts',
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
  app: { head: { htmlAttrs: { lang: 'ru' } } },

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
