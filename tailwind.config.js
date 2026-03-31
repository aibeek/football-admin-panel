/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                gold: '#ffcc00',
                'card-bg': '#002b3d',
                'darkest-bg': 'rgb(0,19,30)',
                'accent-pink': 'rgb(247,50,99)',
                field: '#03111a',
                pitch: '#082234',
                paper: '#f5efdf',
                ink: '#e8f1f6',
                foam: '#0c2536',
                mist: '#12384f',
                turf: '#ffcc00',
                clay: '#f73263',
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['"Space Grotesk"', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            scale: {
                '103': '1.03',
            },
            transitionProperty: {
                height: 'height',
                spacing: 'margin, padding',
            },
            boxShadow: {
                card: '0 20px 55px rgba(0, 0, 0, 0.28)',
                shell: '0 32px 90px rgba(0, 0, 0, 0.48)',
            },
            borderRadius: {
                shell: '2rem',
            },
            backgroundImage: {
                hero: 'linear-gradient(135deg, rgba(255, 204, 0, 0.18) 0%, rgba(255, 204, 0, 0.02) 26%, rgba(255, 204, 0, 0) 34%), linear-gradient(135deg, rgba(0, 43, 61, 1) 0%, rgba(6, 35, 51, 1) 48%, rgba(3, 19, 30, 1) 100%)',
            },
        },
    },
    plugins: [],
}
