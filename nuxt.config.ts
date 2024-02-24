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
    public: {
      blobReadWriteToken: '',
    },
  },
  build: {
    transpile: ['trpc-nuxt'],
  },
  image: {
    // provider: 'vercel',
    dir: 'https://4anunn25btg7t3sl.public.blob.vercel-storage.com',
    alias: { v: 'https://4anunn25btg7t3sl.public.blob.vercel-storage.com' },
    domains: [
      'https://4anunn25btg7t3sl.public.blob.vercel-storage.com',
    ],
    ipx: {},
    format: ['avif', 'webp', 'png', 'jpg'],
  },
})
