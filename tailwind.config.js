/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        maxWidth: {
            container: "1440px",
            contentContainer: "1140px",
            containerSmall: "1024px",
            containerxs: "768px",
        },
        extend: {
            screens: {
                xs: "32px",
                sm: "375px",
                sml: "500px",
                md: "667px",
                mdl: "768px",
                lg: "960px",
                lgl: "1024px",
                xl: "1280px",
            },

            fontFamily: {
                bodyFont: ["Montserrat", "san-serif"],
                titleFont: ["Inter", "san-serif"],
            },
            boxShadow: {
                navbarShadow: "0 10px 30px -10px rgba(2,12, 27, 0.7)",
            },
            colors: {
                bodyColor: "#F2F2F2",
                textGreen: "#0D0D0D",
                textLight: "#404040",
                textDark: "#404040",
                hoverColor: "rgba(43, 42, 42, 0.6)",
            },

            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
