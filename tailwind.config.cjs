/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "background": "#13005A",
        "cards": "#1C82AD",
        "menus": "#00337C",
        "interactives": "#03C988",
      }
    },
  },
  plugins: [],
}
