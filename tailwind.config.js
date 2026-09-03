/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./frontend/src/**/*.{html,ts}'],
  theme: { extend: { colors: { forest: '#002018', 'forest-card': '#06372b', lime: '#bcf063', mist: '#f7f9fb', ink: '#191c1e', muted: '#64706c', line: '#e0e3e5' }, fontFamily: { sans: ['Hanken Grotesk', 'sans-serif'], mono: ['Geist', 'sans-serif'] }, borderRadius: { card: '24px' } } },
  plugins: []
};
