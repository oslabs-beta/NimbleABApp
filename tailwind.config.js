/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/src/**/*.{ts,tsx,js,jsx,html}", "./app/dist/*.html"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1DB954",

          secondary: "#b68ad8",

          accent: "#f9b3e9",

          neutral: "#27242d",

          "base-100": "#191414",

          info: "#7bc9ea",

          success: "#125930",

          warning: "#fba22d",

          error: "#eb7575",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
