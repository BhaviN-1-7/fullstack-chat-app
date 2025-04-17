// import daisyui from "daisyui";

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
// "./src/**/*.{js,ts,jsx,tsx}",],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     daisyui
//   ],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms') // Add this if you want form plugin too
  ],
  daisyui: {
    themes: ["light", "dark","cupcake","retro"], // Optional: specify themes you want to use
  },
}