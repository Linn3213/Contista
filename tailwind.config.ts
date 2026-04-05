import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'background': '#F6F1EB',
        'surface': '#FFFFFF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#fbf2ee',
        'surface-container': '#f5ece9',
        'surface-container-high': '#efe6e3',
        'surface-container-highest': '#e9e1dd',
        'surface-dim': '#e1d8d5',
        'primary': '#9F6B78',
        'on-primary': '#ffffff',
        'secondary': '#A8B5A2',
        'tertiary': '#2F4A43',
        'on-surface': '#2A2624',
        'on-surface-variant': '#504346',
        'outline': '#827376',
        'outline-variant': '#d4c2c5',
        'accent-rose': '#9F6B78',
        'accent-green': '#2F4A43',
        'accent-sage': '#A8B5A2',
      },
      fontFamily: {
        headline: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '1.5rem',
        card: '20px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(42,38,36,0.08)',
        editorial: '0 12px 40px rgba(42,38,36,0.06)',
        hover: '0 20px 50px rgba(42,38,36,0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config
