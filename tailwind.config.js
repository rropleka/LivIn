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
        orange: '#e8871b'
      },
    },
  },
  plugins: [
    flowbitePlugin
  ],
}