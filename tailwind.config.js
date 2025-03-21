/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Inter"', 'sans-serif'],
        },
        colors: {
          'dark-bg': '#1a0b2e',
          'accent-purple': '#6b48ff',
          'light-accent': '#a29bfe',
        },
        boxShadow: {
          'neumorphic': '8px 8px 16px #0d0619, -8px -8px 16px #271041',
        },
      },
    },
    plugins: [],
  }