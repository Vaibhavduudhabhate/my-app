/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/partials/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      screens : {
        "media-415" : "415px"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in": {
            "0%": {
                opacity: 0
            },
            "100%": {
                opacity: 1
            },
        },
      },
      animation: {
        fadeIn: 'fade-in 0.75s ease-in-out 1',
      },
      backgroundColor: {
        "theme_primary_bg" : "#22222E",
        "custom_bg_button": "#15151C",
        "hover_theme_primary_bg" : "#484852",
        "paginationButtonBg" : "#A4A4A9",
        "E9E9EA": "#E9E9EA",
        "E6EAEB":"#E6EAEB",
        "F0F9FF": "#F0F9FF",
        "FFF1F3": "#FFF1F3",
        "ECFDF3": "#ECFDF3",
        "F4F3FF": "#F4F3FF"
      },
      height: {
        "18": "72px",
        "13": "51px",
        "56": "56px",
        "16.67" : "16.67px",
        "7.5" : "30px",
        'h44': '44px'
      },
      width:{
        "208.04": "208.04px",
        "16.67" : "16.67px",
        "7.5" : "30px",
        "c-width":"calc(100% - 75px)",
        "75":"75px",
        "300":"300px"
      },
      gap: {
        "20": "90px"
      },
      boxShadow: {
        "4xl" : "0px 1px 2px 0px #1018280D",
      },
      borderWidth:{
        "1x":"1px",
      },
      borderColor: {
        "7F56D9": "rgb(127, 86, 217)",
        "484852": "#484852",
        "border-A4A4A9" : "#A4A4A9",
        '315256':'#315256',
        "D0D5DD":"#D0D5DD",
        "22222E":"#22222E"
      },
      lineHeight: {
        "9.5": "38.4px",
        "11.5":"48px"
      },
      colors:{
        "A4A4A9": "#A4A4A9",
        "D92D20": "#D92D20",
        "039855": "#039855",
        "667085": "#667085",
        "22222E": "#22222E",
        "344054": "#344054",
        '15151C':'#15151C',
        "101828":"#101828",
        "E9E9EA":"#E9E9EA",
        "E6EAEB":"#E6EAEB",
        "7F7F86":"#7F7F86",
        "red":"red",
        "026AA2":"#026AA2",
        "C01048": "#C01048",
        "5925DC": "#5925DC",
        "027A48":"#027A48"
      },
      fontSize:{
        "text-3.5xl" : "32px",
        "text-40px":"40px"
      },
      margin:{
        "0.6": "5px"
      },
      padding:{
        "padding4.5": "18px",
        "pl300": "300px"
      },
      divideColor:{
        "D0D5DD": "#D0D5DD"
      },
    },
  },
  plugins: [],
};
