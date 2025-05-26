module.exports = {
  purge: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Used in Tailwind < v3.0
  theme: {
    extend: {
      opacity: ['group-hover'],
      screens: {
        'lg-custom': '1155px',
      }
    },
  },
  variants: {},
  plugins: [],
};
