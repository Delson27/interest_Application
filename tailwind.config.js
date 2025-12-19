/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5878FF",
        primaryLight: "#E7ECFF",
        cardBlue: "#F4F6FF",
        textDark: "#1A1A1A",
        textLight: "#6B7280",

        amountBlue: "#EAF0FF",
        chipBlue: "#DDE6FF",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
