/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#19222f',
        'secondary':'#e0efec',
        'buttons':'#429FDD'
      },
      fontFamily:{
        poppins:['Poppins','sans-serif']
      }
    },
  },
  plugins: [],
}

