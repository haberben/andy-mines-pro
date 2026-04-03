/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        candy: {
          primary: '#ff3d71',
          secondary: '#7b1fa2',
          accent: '#ff00ff',
          bg: '#1a103d',
          gold: '#FFD700',
          'gold-light': '#FFF080',
          'gold-dark': '#B8860B',
          purple: '#4a148c',
          pink: '#e91e63'
        },
      },
      backgroundImage: {
        'candy-gradient': 'radial-gradient(circle at top left, #2a0845 0%, #1a103d 50%, #0f0c29 100%)',
        'gold-shimmer': 'linear-gradient(45deg, transparent 25%, rgba(255, 215, 0, 0.2) 50%, transparent 75%)',
        'jewel-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'bounce-soft': 'bounce-soft 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
