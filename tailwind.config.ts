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
        // Sampled from the Danvice badge: a single red family plus its cream.
        // `maroon` carries structure (dark sections, body text), `cream` is the
        // light ground, `brand` is the signature red reserved for CTAs.
        maroon: {
          50: '#FCF3F2',
          100: '#F8E5E4',
          200: '#EFC8C7',
          300: '#DC9C9A',
          400: '#C1615F',
          500: '#9E2B2B',
          600: '#7E0A11',
          700: '#68080E',
          800: '#4E060A',
          900: '#360407',
          950: '#220205',
        },
        cream: {
          50: '#FCF6EA',
          100: '#F7EDDC',
          200: '#F1E1C9',
          300: '#E6CFAE',
          400: '#D6B68C',
        },
        brand: {
          300: '#E4666C',
          400: '#D42630',
          500: '#C1121C',
          600: '#A50E18',
          700: '#870B13',
        },
        'brand-ink': '#FDF7EC',
        success: '#2E7D5B',
        danger: '#B3392F',

        background: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
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
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '600' }],
        lede: ['1.125rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
        '3xl': '36px',
      },
      boxShadow: {
        // Navy-tinted, never black — the biggest premium-vs-template tell.
        xs: '0 1px 2px 0 rgb(54 4 7 / 0.04)',
        card: '0 1px 2px rgb(54 4 7 / 0.04), 0 4px 12px -2px rgb(54 4 7 / 0.06)',
        'card-hover': '0 2px 4px rgb(54 4 7 / 0.05), 0 12px 28px -6px rgb(54 4 7 / 0.12)',
        raised: '0 8px 24px -8px rgb(54 4 7 / 0.14)',
        modal: '0 24px 64px -16px rgb(34 2 5 / 0.35)',
        'sticky-bar': '0 -8px 24px -12px rgb(34 2 5 / 0.22)',
        'gold-focus': '0 0 0 3px rgb(232 181 99 / 0.45)',
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
      spacing: { bar: '4.5rem', 13: '3.25rem' },
      maxWidth: { prose: '68ch' },
    },
  },
  plugins: [],
};

export default config;
