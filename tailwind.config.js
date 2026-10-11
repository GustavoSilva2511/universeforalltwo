/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cosmic: "#501343",
        abyss: "#100B1F",
        nebula: "#9C3BA5",
        nebulaDeep: "#7E247F",
        wine: "#290922",
        starlight: "#EDE9FE",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

