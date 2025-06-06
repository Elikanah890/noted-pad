/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.100'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.bold') },
        'h2': { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.semibold') },
        'h3': { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.medium') },
        'a': { color: theme('colors.blue.600'), textDecoration: 'underline' },
        'a:hover': { color: theme('colors.blue.800') },
        'ul': { listStyleType: 'disc', paddingLeft: theme('spacing.5') },
        'ol': { listStyleType: 'decimal', paddingLeft: theme('spacing.5') },
      });
    },
  ],
};