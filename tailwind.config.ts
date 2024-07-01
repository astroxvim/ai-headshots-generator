import { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/theme');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|avatar|button|card|checkbox|divider|dropdown|input|kbd|listbox|menu|radio|select|spacer|toggle|ripple|spinner|popover|scroll-shadow).js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-vertical-gradient': 'linear-gradient(180deg, rgba(102, 69, 235, 0.4) 0%, rgba(31, 197, 219, 0.3) 50%, rgba(154, 40, 230, 0.2) 100%)',
        'custom-horizontal-gradient': 'linear-gradient(90deg, rgba(44, 33, 104, 1) 0%, rgba(18, 65, 83, 1) 50%, rgba(37, 15, 63, 1) 100%)',
        'custom-blur-bg': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,24,51,.6), rgba(25,8,43,.3))'
      },
      colors: {
        primary: '#6645EB',
        secondary: '#1FC5DB',
        "upic-primary": "#50defb",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;