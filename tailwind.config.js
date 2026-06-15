/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9faf8',
          100: '#f3f4f0',
          200: '#e7e9e2',
          300: '#ddddd4',
          400: '#c1bfb7',
          500: '#a09a92',
          600: '#7a7470',
          700: '#505047',
          800: '#2a2824',
          900: '#0f0e0c',
        },
        accent: {
          50: '#f0f9f7',
          100: '#d4f0ed',
          200: '#a8dfe0',
          300: '#7ccdd2',
          400: '#50bcc4',
          500: '#2daa96',
          600: '#1f8970',
          700: '#166857',
          800: '#0d473e',
          900: '#052726',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
