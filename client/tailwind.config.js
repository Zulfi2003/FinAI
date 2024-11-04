// /** @type {import('tailwindcss').Config} */
// // prettier-ignore

// module.exports = {
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         'linkedin': '#00A0DC',
//         'github': '#FAFBFC'
//       },
//       keyframes: {
//         fill: {
//           '0%': { width: '0%' },
//           '100%': { width: 'attr(data-value)' }
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(5em)' },
//           '100%': { transform: 'translateY(0)' }
//         },
//       },
//       animation: {
//         fill: 'fill 1s ease-in-out forwards',
//         slideUp: 'slideUp 0.25s ease-out forwards'
//       },
//       maxWidth: {
//         '1/3': '33.333333%',
//       },
//       minWidth: {
//         '1/3': '33.333333%',
//       }
//     },
//   },
//   plugins: []
// };


module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',
        'secondary': '#1E40AF',
        'accent': '#60A5FA',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};