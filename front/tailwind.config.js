/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#050509',
        'chat-panel': '#101014',
        'chat-border': '#27272f',
      },
    },
  },
  plugins: [],
}
