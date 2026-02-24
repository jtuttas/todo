/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5F6463',
        secondary: '#9D9B9D',
        accent: '#FF4845',
      },
    },
  },
  plugins: [],
}
