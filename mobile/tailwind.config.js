/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './contexts/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
    './App.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
