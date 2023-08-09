/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    darkMode: ["class"],
    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: "hsl(217, 10%, 27%);",
                    dark: {
                        DEFAULT: "#212121",
                    },
                },
                muted: {
                    DEFAULT: "hsl(220, 53%, 100%)",
                    dim: "hsl(220, 50%, 95%)",
                    dimmer: "hsl(220, 50%, 85%)",
                    dark: {
                        DEFAULT: "hsla(216, 17%, 23%, 0.96)",
                        dim: "hsla(0, 0%, 45%, 0.196)",
                        dimer: "hsla(0, 0%, 35%, 0.196)",
                    },
                },
            },
        },
    },
    plugins: [],
};
