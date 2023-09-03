/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/src/**/*.{ts,tsx,js,jsx,html}',
    './app/dist/*.{html,js}',
    './app/src/index.html',
  ],
  plugins: [require('daisyui')],
};
