/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eef7ff', 100: '#d9edff', 200: '#bce0ff', 300: '#8eccff', 400: '#58b0ff', 500: '#3291ff', 600: '#1a73f5', 700: '#155ce1', 800: '#174bb6', 900: '#19418f', 'DEFAULT': '#1a3a4a' },
        accent: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
        civic: { dark: '#0f1923', card: '#162332', border: '#1e3a4f', text: '#94a3b8', light: '#f8fafc', surface: '#ffffff' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif']
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 5px rgba(26,115,245,0.3)' }, '50%': { boxShadow: '0 0 20px rgba(26,115,245,0.6)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } }
      }
    }
  },
  plugins: [],
}
