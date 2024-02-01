import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    
    extend: {
      colors: {
        orange: '#e8871b',
        'light-orange': '#edb458',
        'dark-orange': '#a3320b',
      },
      fontFamily: {
        'default-font': ['Poppins'],
      },
    },
  },
  plugins: [
    flowbitePlugin
  ],
}