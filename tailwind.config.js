/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB7D5',
          softPink: '#FFE5EC',
          hotPink: '#FF6584',
          deepPink: '#E84A7F',
          lavender: '#E2D4F0',
          purple: '#B39DDB',
          deepPurple: '#7E57C2',
          blue: '#D0E6FF',
          sky: '#81D4FA',
          mint: '#D8F3DC',
          yellow: '#FFF2B2',
          gold: '#FFD166',
          peach: '#FFDAC1',
          cream: '#FFF9FB'
        }
      },
      fontFamily: {
        cute: ['"Nunito"', '"Fredoka"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cute': '0 8px 24px -4px rgba(232, 74, 127, 0.15), 0 4px 12px -2px rgba(179, 157, 219, 0.2)',
        'cute-lg': '0 16px 36px -6px rgba(232, 74, 127, 0.25), 0 8px 18px -4px rgba(179, 157, 219, 0.3)',
        'inner-cute': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'sparkle': 'sparkle 1.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'scale(1.2) rotate(15deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
