/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00c7ff',
                secondary: '#ffb100',
                tertiary: '#ff00b6',
            }
        },

        fontFamily: {
            display: ['Dosis', 'sans-serif'],
            mono: ['"Source Code Pro"', 'monospace'],
        }
    },
    darkMode: 'class',
    plugins: [require('tailwindcss-safe-area')],
}
