const tailwindcss = require("tailwindcss");
module.exports = {
  plugins: [tailwindcss("./tailwind.config.cjs"), require("autoprefixer")],
};
