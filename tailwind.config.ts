import type { Config } from 'tailwindcss'

export const screens = {
  '2xl': { max: '1399px' },
  'lg': { max: '1023px' },
  'md': { max: '767px' },
  'sm': { max: '639px' },
  'xl': { max: '1279px' },
  'xs': { max: '479px' },
} as const

export const screenBreakpoints = {
  '2xl': 1399,
  'lg': 1023,
  'md': 767,
  'sm': 639,
  'xl': 1279,
  'xs': 479,
} as const

export type ScreenSize = keyof (typeof screens)

export default {
  // content: ['./src/**/*.{vue,ts,tsx}'],
  // theme: {
  //   screens,
  // },
} satisfies Config
