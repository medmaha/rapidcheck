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
                        DEFAULT: "hsl(215, 20%, 60%)",
                        dim: "hsl(215, 14%, 30%)",
                        dimer: "hsl(215, 14%, 24%)",
                    },
                },
            },
        },
    },
    plugins: [],
};
