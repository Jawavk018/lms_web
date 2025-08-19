module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    screens: {
      'xs': '320px',
      // => @media (min-width: 320px) { ... }

      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '992px',
      // => @media (min-width: 992px) { ... }

      'xl': '1200px',
      // => @media (min-width: 1200px) { ... }

      'xxl': '1400px',
      // => @media (min-width: 1400px) { ... }

      'maxDesktop': {'max': '1800px'},
      // => @media (max-width: 1700px) { ... }

      'max2Xl': {'max': '1600px'},
      // => @media (max-width: 1600px) { ... }

      'maxXl': {'max': '1399px'},
      // => @media (max-width: 1200px) { ... }

      'maxLg': {'max': '1199px'},
      // => @media (max-width: 1200px) { ... }

      'maxMd': {'max': '991px'},
      // => @media (max-width: 991px) { ... }

      'maxSm': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'maxXs': {'max': '575px'},
      // => @media (max-width: 575px) { ... }


      'minMaxDesktop': {'min': '1601px', 'max': '1800px'},
      // => @media (min-width: 1601px) and (max-width: 1800px) { ... }

      'minMaxLaptop': {'min': '1401px', 'max': '1600px'},
      // => @media (min-width: 1401px) and (max-width: 1600px) { ... }

      'minMaxTablet': {'min': '1201px', 'max': '1400px'},
      // => @media (min-width: 1201px) and (max-width: 1400px) { ... }

      'minMaxTab': {'min': '992px', 'max': '1200px'},
      // => @media (min-width: 992px) and (max-width: 1200px) { ... }

      'minMaxTabSmall': {'min': '768px', 'max': '991px'},
      // => @media (min-width: 768px) and (max-width: 991px) { ... }

      'minMaxMobile': {'min': '576px', 'max': '767px'},
      // => @media (min-width: 576px) and (max-width: 576px) { ... }
    },
    container: {
      center: true,
      padding: '15px',
    },
    fontFamily: {
      'primary': ["'Nunito Sans', sans-serif"],
      'secondary': ["'Raleway', sans-serif"],
      'fontawesome': ["Font Awesome 5 Pro"],
    },
    extend: {
      colors: {
        'white': '#ffffff',
        'black': '#000',
        'bodyText': '#575757',
        'heading': '#141517',
        'themeBlue': '#2467EC',
        'themeOrange': '#FFB013',
        'themeGray': '#A2A2A2',
        'borderGray': '#edeef2',
        'blackBg': '#000',
        'grayBg': '#F6F8FB',
      },
    },
  },
  plugins: [],
}
