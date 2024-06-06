/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      width: {
        '70vw': '70vw',
      },
    },
  },
  plugins: [],
  variants: {
    extend: {},
  },
}

