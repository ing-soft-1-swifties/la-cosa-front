// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
