/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#2a3452',
          700: '#1c2438',
          800: '#16264d',
          900: '#12172b',
          950: '#0f1c3a',
        },
        gold: {
          200: '#f2c869',
          300: '#e8c877',
          400: '#d4a537',
          500: '#c2941f',
          600: '#936e19',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#eef1f8',
          subtle: '#f6f7fb',
        },
        border: '#e4e7ee',
        divider: '#eef0f5',
        'text-body': '#5e697f',
        'text-muted': '#676e7c',
        'text-faint': '#9aa4b6',
        'text-strong': '#5b6472',
        'text-quote': '#3f4a5e',
        success: '#5f9c3a',
        error: '#c0392b',
        whatsapp: '#25d366',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-work-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'hero-shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.7s ease both',
        'bounce-down': 'bounce-down 1.8s ease-in-out infinite',
        'hero-shimmer': 'hero-shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};