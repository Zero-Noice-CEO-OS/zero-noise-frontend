import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1F3A5F',
        accent: '#2E6F6E',
        surface: { light: '#F4F6F8', dark: '#1A1D22' },
        text: { primary: '#1A1A1A', muted: '#6B7280' },
        success: '#2E7D32',
        warning: '#B98900',
        destructive: '#C0392B',
        border: { light: '#E2E5E9', dark: '#2A2E35' },
        bg: { dark: '#0F1115' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '8px', modal: '12px' },
    },
  },
  plugins: [],
}
export default config
