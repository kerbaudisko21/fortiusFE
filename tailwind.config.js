/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customPurple: '#E6E6E6',
        customPurple2: '#AE82A5',
        customPurple3: '#D896FF'
      },
    },
  },
  plugins: [],
}