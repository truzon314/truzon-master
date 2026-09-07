const baseConfig = require('@truzon/config/tailwind/base');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...(baseConfig.theme?.extend || {}),
      colors: {
        // Luxury Brand Navy from Public Web
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#2a3452',
          700: '#1c2438',
          800: '#16264d',
          900: '#12172b',
          950: '#0f1c3a',
        },
        // Luxury Brand Gold from Public Web
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#f2c869',
          300: '#e8c877',
          400: '#d4a537',
          500: '#c2941f',
          600: '#936e19',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#eef1f8',
          subtle: '#f6f7fb',
        },
        brand: {
          primary: '#0f1c3a',
          secondary: '#16264d',
          accent: '#c2941f',
          accentHover: '#936e19',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
};