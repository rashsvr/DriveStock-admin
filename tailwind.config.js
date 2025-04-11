/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
       
        'dark-bluish-black': '#1A2526',
        'highlight-orange': '#F97316',
        'highlight-teal': '#2DD4BF',
        'highlight-blue': '#60A5FA',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [ "dark","light"  ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
  },
};