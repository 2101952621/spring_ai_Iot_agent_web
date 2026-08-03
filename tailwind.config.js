/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-light': '#60a5fa',
        'primary-50': '#eff6ff',
        'brand-start': '#e0f2fe',
        'brand-end': '#f0f9ff',
      },
      boxShadow: {
        card: '0 4px 20px rgba(59, 130, 246, 0.08)',
        float: '0 8px 30px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
