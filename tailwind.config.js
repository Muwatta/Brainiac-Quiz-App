module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Comic Sans MS"', 'cursive'], // Example cursive font
        serif: ['Georgia', 'serif'], // Example serif font
        tesla: ['sans-serif'], // Custom serif font
      },
      colors: {
        'deep-navy': '#001428',
        'dark-blue': '#001e3b',
        'midnight-blue': '#00284f',
        'light-text': '#000000',
        'dark-text': '#ffffff',
      },
    },
  },
  plugins: [],
};