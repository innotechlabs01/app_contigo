/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2269ED',
          'blue-hover': '#1B5CD8',
          'blue-active': '#104EC2',
          'blue-dark': '#0B3789',
        },
        surface: {
          page: '#FAFCFE',
          outer: '#E5E9F0',
        },
        text: {
          primary: '#222222',
          secondary: '#4A4A4A',
          muted: '#777777',
        },
        border: {
          card: '#E8E8E8',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '24px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}