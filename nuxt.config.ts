// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-module-eslint-config',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@tresjs/nuxt',
  ],
  googleFonts: {
    families: {
      Inter: true,
    },
  },
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
  },
  build: {
    transpile: ['trpc-nuxt'],
  },
  image: {
    provider: 'ipx',
    ipx: {},
    format: ['avif', 'webp', 'png', 'jpg'],
  },
})
