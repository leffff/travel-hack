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
          DEFAULT: "#1D1D1D",
          content: "#F5F5F5"
        },
        text: {
          DEFAULT: "#1D1D1D",
          secondary: "#747474"
        },
        button: {
          accent: "#EBEBEB",
          outline: "#D9D9D9"
        },
        checkbox: {
          border: "#A6A6A6"
        },
        natural2: "#2F2F2F"
      },
      fontFamily: {
        grotesk: ["'Proto Grotesk'", "SuisseIntl", "sans-serif"]
      },
      boxShadow: {
        dropdown: "0px 4px 30px 0px rgba(148, 148, 148, 0.25)"
      }
    }
  }
};
