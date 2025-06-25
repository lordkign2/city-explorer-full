// tailwind.config.js
module.exports = {
    content: [
      './views/**/*.ejs',
      './public/**/*.js'
    ],
    darkMode: 'class', // Enables dark mode using .dark class
    theme: {
      extend: {
        colors: {
          primary: '#4F46E5', // Indigo-600
          secondary: '#6366F1',
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui']
        },
        boxShadow: {
          card: '0 2px 12px rgba(0, 0, 0, 0.1)'
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.5rem'
        },
        animation: {
          fadeIn: 'fadeIn 1s ease-out'
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
          }
        }
      }
    },
    plugins: []
  };