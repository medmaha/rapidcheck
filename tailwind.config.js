/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],

    theme: {
        extend: {
            colors: {
                muted: {
                    DEFAULT: "hsl(217, 10%, 27%);",
                    dim: "hsl(217, 10%, 17%);",
                    dimmer: "hsl(217, 10%, 7%);",
                    dark: {
                        DEFAULT: "hsl(215, 20%, 60%)",
                        dim: "hsl(215, 14%, 30%)",
                        dimer: "hsl(215, 14%, 24%);",
                    },
                },
            },
        },
    },
    plugins: [],
};
