import type { Config } from 'tailwindcss'

// Brand tokens from design_handoff_kt_website/design/kt-tokens.css.
// Gold pairs with dark surfaces only; gold-deep with light surfaces only — never swapped.
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#262623',
        ivory: '#F3F0EB',
        gold: {
          DEFAULT: '#C0A278',
          deep: '#7E6A4F',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
} satisfies Config
