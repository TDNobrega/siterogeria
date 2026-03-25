import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ──────────────────────────────────
        primary:   '#C5973A',   // gold — main CTA, highlights
        secondary: '#D4A85C',   // lighter gold — subtle accents
        support:   '#AD7E22',   // dark gold — hover states
        'brand-light': '#F8F4EA', // warm cream — softest bg tint
        // ── Neutrals ───────────────────────────────────────
        ink:    '#1A1A1A',   // headings & body text
        muted:  '#6B6B6B',   // secondary text
        border: '#E8E8E8',   // default borders
      },
      fontFamily: {
        // URW Form → DM Sans (geometric sans-serif, closest match)
        title: ['"URW Form"', '"DM Sans"', 'system-ui', 'sans-serif'],
        // Avenir LT Std → Nunito Sans (humanist, closest match)
        subtitle: ['"Avenir LT Std"', '"Nunito Sans"', 'sans-serif'],
        // Body — clean sans-serif
        body: ['"Nunito Sans"', '"DM Sans"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1':      ['clamp(2rem, 4vw, 3rem)',   { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'h2':      ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
        'h3':      ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.3' }],
      },
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 16px 0 rgb(0 0 0 / 0.08)',
        'button': '0 2px 8px 0 rgb(197 151 58 / 0.40)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
