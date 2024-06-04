const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/theme/components**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        kakao: "#FEE500",
        google: "#f44336",
        main: "#0064FF",
        grey: "#CBCBCB",
        whitesmoke: "#f5f5f5",
        primaryblue: "#3F51B5",
        primaryred: "#FF6C6A",
        lightgrey: "#eeebeb",
        badge: "#f2f4f7",
        silver: "#b5b6b9",
        royalblue: "#3366ff",
        darkgray: "#a4a5a7",
        dimgray: "#656667",
        primary: "#34363D",
        darkgrey: "#3c3a3a",
        aliceblue: "#f1f4ff",
        green: "#449F3C",
        cornflowerblue: "#7493ff",
        error: "#EA2A2A",
        salomon: "#ff6c6a",
        seashell: "#fff2ee",
        limegreen: "#11b143",
        mediumpurple: "#7c6ecd",
        lavender: "#cad4ff",
        navy: "#3f51b5",
        skyblue: "#7493FF",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
});
