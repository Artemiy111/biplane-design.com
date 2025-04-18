export const breakpoints = {
  '2xl': 1400,
  'xl': 1280,
  'lg': 1024,
  'md': 768,
  'sm': 640,
  'xs': 480,
} as const

export type ScreenSize = keyof (typeof breakpoints)