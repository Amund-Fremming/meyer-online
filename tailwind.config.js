/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'lobster': ['Lobster', 'cursive'],
        'roboto': ['Roboto Condensed', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

