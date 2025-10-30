// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-in-left": { "0%": { transform: "translateX(-50px)", opacity: 0 }, "100%": { transform: "translateX(0)", opacity: 1 } },
        "slide-in-right": { "0%": { transform: "translateX(50px)", opacity: 0 }, "100%": { transform: "translateX(0)", opacity: 1 } },
        "gradient": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "float": { "0%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-20px)" }, "100%": { transform: "translateY(0px)" } },
      },
      animation: {
        "slide-in-left": "slide-in-left 0.8s ease-out forwards",
        "slide-in-right": "slide-in-right 0.8s ease-out forwards",
        "gradient": "gradient 6s ease infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "float": "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
