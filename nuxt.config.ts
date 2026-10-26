import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],

  ssr: true,

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      titleTemplate: '%s | Biplane-Design',
    },
  },

  css: ['./src/shared/assets/css/main.css'],

  site: {
    url: 'https://biplane-design.com',
    name: 'Biplane-Design',
    defaultLocale: 'ru',
  },

  // Build-time default for the address the server uses to call its own
  // `/api/trpc`. Not validated at build: only runtime env is.
  runtimeConfig: {
    BASE_URL: process.env.BASE_URL ?? 'http://localhost:3000',
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  experimental: {
    typedPages: true,
  },

  compatibilityDate: '2026-01-28',

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  telemetry: { enabled: false },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    families: [{
      name: 'Montserrat',
    }],
  },

  image: {
    format: ['avif', 'webp', 'png', 'jpg'],
  },

  robots: {
    disallow: ['/admin/*'],
  },

  shadcn: {
    componentDir: './src/shared/ui/kit',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
})
