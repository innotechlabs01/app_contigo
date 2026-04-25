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
          DEFAULT: '#87CEEB',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0AA5E2',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        secondary: '#00668A',
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