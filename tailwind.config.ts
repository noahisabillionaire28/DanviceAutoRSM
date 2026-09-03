import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem' },
      screens: { '2xl': '1240px' },
    },
    extend: {
      colors: {
        // Sampled from the Danvice Auto logo: the blue and the orange are the
        // logo's own values, unchanged. `blue` carries structure (dark
        // sections, body text, links), `neutral` is the light ground, `orange`
        // is the signature colour reserved for the CTA.
        //
        // Two roles for blue, because one cannot do both. blue-500 (#3F7BC0)
        // is the logo blue exactly, and it is a mid-tone: white body text on
        // it is 4.37:1, under AA. So the dark field is blue-900, the logo blue
        // taken down to a navy, and 500 stays the accent — rules, dividers,
        // the mark itself. Every pairing is asserted in scripts/checks.ts.
        blue: {
          50: '#F1F6FC',
          100: '#DFEAF7',
          200: '#C0D5EE',
          300: '#93B6E0',
          400: '#6698CE',
          500: '#3F7BC0',
          600: '#33639B',
          700: '#2A4F7C',
          800: '#1C3859',
          900: '#12253A',
          950: '#0B1826',
        },
        neutral: {
          50: '#F7F8FA',
          100: '#EFF2F6',
          200: '#E2E7EE',
          300: '#CBD3DF',
        },
        // 500 is the logo orange exactly and stays the brand accent — rules,
        // eyebrows on the dark field, the logo itself. The CTA lives lower down
        // the ramp: its label is white, and white does not clear AA until the
        // fill reaches 700 (5.05:1). 500 with a white label is 2.74:1.
        orange: {
          400: '#F4954A',
          500: '#F07D22',
          600: '#D2620F',
          700: '#B35309',
          800: '#9C470A',
          900: '#833C08',
        },
        success: '#2E7D5B',
        danger: '#B3392F',

        background: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        foreground: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--fg-muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-fg': 'rgb(var(--accent-fg) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem,6vw,4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-lg': ['clamp(2.25rem,4.5vw,3.25rem)', { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['clamp(1.75rem,3vw,2.25rem)', { lineHeight: '1.12', letterSpacing: '-0.015em', fontWeight: '600' }],
        // The two heading tiers below the display sizes. They exist because
        // Tailwind's own text-lg/xl/2xl carry no font-weight: every heading
        // using them inherited body 400 and read as prose, while the display
        // sizes above are 600 — so the hierarchy flattened everywhere except
        // the top of a page. Carrying the weight in the token is what stops
        // that recurring; scripts/checks.ts asserts headings use these.
        //
        //   subhead    a titled block that owns a chunk of a page
        //   card-title a repeated grid item, or a widget title inside a card
        subhead: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'card-title': ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '600' }],
        lede: ['1.125rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        // Every card, panel, modal and framed image rounds at `card`. Cards
        // used to round at 14/20/28px depending on which page they sat on,
        // which reads as three different component families. Two steps is the
        // whole scale: `md` for controls, `card` for surfaces.
        card: '16px',
      },
      boxShadow: {
        // Navy-tinted, never black — the biggest premium-vs-template tell.
        xs: '0 1px 2px 0 rgb(18 37 58 / 0.05)',
        card: '0 1px 2px rgb(18 37 58 / 0.05), 0 4px 12px -2px rgb(18 37 58 / 0.07)',
        'card-hover': '0 2px 4px rgb(18 37 58 / 0.06), 0 12px 28px -6px rgb(18 37 58 / 0.14)',
        modal: '0 24px 64px -16px rgb(11 24 38 / 0.35)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.16, 1, 0.3, 1)',
        soft: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'overlay-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'dialog-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, -48%) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 400ms cubic-bezier(0.16,1,0.3,1) both',
        'overlay-in': 'overlay-in 200ms ease-out',
        'sheet-up': 'sheet-up 320ms cubic-bezier(0.32,0.72,0,1)',
        'dialog-in': 'dialog-in 240ms cubic-bezier(0.16,1,0.3,1)',
      },
      // 13 is not in Tailwind's default scale. Button's lg size authored h-13
      // and it silently emitted no CSS at all, collapsing every size="lg"
      // button to its line box. Asserted in scripts/checks.ts.
      spacing: { 13: '3.25rem' },
      maxWidth: { prose: '68ch' },
    },
  },
  plugins: [],
};

export default config;
