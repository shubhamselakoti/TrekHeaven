/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0ED',
          100: '#C1D9CF',
          200: '#9CC2B1',
          300: '#77AB93',
          400: '#5C987D',
          500: '#2D6A4F', // primary
          600: '#266244',
          700: '#1F5939',
          800: '#18512E',
          900: '#104121',
        },
        secondary: {
          50: '#E6ECEC',
          100: '#C1D0D1',
          200: '#9BB2B4',
          300: '#759497',
          400: '#577B82',
          500: '#1A535C', // secondary
          600: '#174C54',
          700: '#13424A',
          800: '#0F3941',
          900: '#0A2930',
        },
        accent: {
          50: '#FFF0EB',
          100: '#FFD8CC',
          200: '#FFBFAC',
          300: '#FFA68D',
          400: '#FF8A73',
          500: '#FF6B35', // accent
          600: '#FF5C26',
          700: '#FF4A17',
          800: '#FF3908',
          900: '#FA2800',
        },
        success: '#2CB67D',
        warning: '#F7B801',
        error: '#E42C64',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.pexels.com/photos/691034/pexels-photo-691034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        'trek-card-gradient': 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};