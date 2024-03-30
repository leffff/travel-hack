/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        primary: "#FFCF08",
        bg: {
          DEFAULT: "#1D1D1D"
        },
        text: {
          DEFAULT: ""
        }
      }
    }
  }
};
