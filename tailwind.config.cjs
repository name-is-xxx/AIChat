const green = require("./src/theme/colors.ts").green;

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: true },
  theme: {
    extend: {
      colors: green,
    },
  },
  plugins: [],
};
