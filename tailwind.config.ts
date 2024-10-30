import type { Config } from 'tailwindcss'

import animate from 'tailwindcss-animate'
import pkg from 'tailwindcss/defaultTheme'

const { fontFamily } = pkg

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
  content: ['./src/**/*.{vue,ts,tsx}'],
  darkMode: ['class'],
  plugins: [animate],
  safelist: ['dark'],

  theme: {
    container: {
      center: true,
      padding: '0rem',
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      fontFamily: {
        sans: ['Montserrat', ...fontFamily.sans],
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
    },
    fontSize: {
      '2xl': '32px',
      '3xl': '36px',
      'base': '20px',
      'lg': '24px',
      'sm': '16px',
      'xl': '28px',
      'xs': '14px',
    },
    screens,
  },
} satisfies Config
