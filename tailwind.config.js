/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00fff5',
          magenta: '#ff00ff',
          violet: '#8b5cf6'
        }
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite'
      },
      boxShadow: {
        'neon': '0 0 10px rgba(139, 92, 246, 0.2), inset 0 0 10px rgba(139, 92, 246, 0.1)'
      }
    },
  },
  plugins: [],
};