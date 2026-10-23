/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f6f9',
          100: '#e6eaf1',
          200: '#c9d3e0',
          300: '#a2b1c8',
          400: '#7488a8',
          500: '#54698c',
          600: '#425372',
          700: '#37455e',
          800: '#242f42',
          900: '#131a27',
          950: '#0b0f18',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2f6fdb',
          600: '#1e56b8',
          700: '#1a4795',
          800: '#193c78',
          900: '#193463',
        },
        critical: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
        },
        warn: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
        },
        caution: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          500: '#ca8a04',
          600: '#a16207',
          700: '#854d0e',
        },
        stable: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(19, 26, 39, 0.04), 0 1px 3px 0 rgba(19, 26, 39, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
