import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        accent: 'var(--accent)',
        secondary: 'var(--secondary)',
        border: 'var(--border)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        button: '14px',
        card: '18px',
        input: '12px',
        modal: '24px',
        badge: '999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
        modal: 'var(--shadow-modal)',
      },
      lineHeight: {
        cozy: '150%',
      },
    },
  },
  plugins: [],
}
export default config

