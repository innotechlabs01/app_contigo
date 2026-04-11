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
        primary: {
          DEFAULT: '#00668A',
          50: '#E6F3F7',
          100: '#CCE7EF',
          200: '#99CFDFF',
          300: '#66B7BF',
          400: '#339F8F',
          500: '#00668A',
          600: '#005269',
          700: '#003D56',
          800: '#002943',
          900: '#001430',
        },
        secondary: '#87CEEB',
        background: '#F8FAFC',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-lexend)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '18px',
      },
      borderRadius: {
        DEFAULT: '9999px',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 102, 138, 0.08)',
      },
    },
  },
  plugins: [],
}