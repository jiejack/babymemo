/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: '#FF6B6B',
        mint: '#4ECDC4',
        yellow: '#FFE66D',
        lavender: '#E2D1F9',
        sky: '#A7DBD8',
        peach: '#FFDAB9',
        cream: '#FFF8F0',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pulse-soft': 'pulse 4s ease-in-out infinite',
        'bubble': 'bubble 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bubble: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        babymemo: {
          "primary": "#FF6B6B",
          "secondary": "#4ECDC4",
          "accent": "#FFE66D",
          "neutral": "#FFF8F0",
          "base-100": "#ffffff",
        },
      },
    ],
  },
}
