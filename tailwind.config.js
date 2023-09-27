/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '20rem', //320
        md: '30rem', //480
        lg: '48rem', //768
        xl: '64rem', //1024
        '2xl': '75rem', //1200
      },
    },
    extend: {
      colors: {
        down: 'rgb(214, 38, 63)',
        up: 'rgb(1, 145, 76)',
      },
      boxShadow: {
        left: '1px 0 0 0px rgba(0, 0, 0)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in': 'slide-in 0.2s ease-in',
        'overlay-show': 'overlay-show .25s cubic-bezier(0.6,0.04,0.98,0.34)',
        'searchbar-in': 'searchbar-in .45s ease-in',
      },
      backgroundImage: {
        'magnifying-glass': 'url("/public/magnifying-glass.svg")',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'accordion-down': {
          from: {height: 0},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: 0},
        },
        'slide-in': {
          from: {
            transform: 'translateY(2rem)',
            opacity: 0.25,
          },
          to: {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        'overlay-show': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        'searchbar-in': {
          from: {
            top: '1rem',
            width: '11rem',
            opacity: 0,
          },
          to: {
            top: '25%',
            width: '40vw',
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    plugin(function ({addBase, addUtilities, theme, addComponents}) {
      addBase({
        h2: {
          fontSize: theme('fontSize.3xl'),
          fontWeight: theme('fontWeight.semibold'),
          margin: '2rem 0',
          color: theme('textDecorationColor.slate.800'),
        },
        p: {
          fontSize: theme('fontSize.md'),
          maxWidth: '40rem',
          marginBottom: '1.25rem',
          color: theme('textDecorationColor.slate.800'),
        },
      }),
        addComponents({
          '.circle': {
            width: '1rem',
            height: '1rem',
            backgroundColor: theme('textDecorationColor.neutral.400'),
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '.5rem',
          },
          '.tabs-list': {
            boxShadow: '0 1px 0 var(--tw-ring-color)',
            'column-gap': '1px',
          },
          '.tabs-active': {
            boxShadow:
              'inset 1px 0 0 var(--tw-ring-color),inset 0 1px 0 var(--tw-ring-color),inset -1px 0 0 var(--tw-ring-color), 0 1px 0 white',
          },
          '.tabs-content': {
            boxShadow:
              'inset 1px 0 0 var(--tw-ring-color), inset 0 -1px 0 var(--tw-ring-color), inset -1px 0 0 var(--tw-ring-color)',
          },
          '.dialog_overlay': {
            backgroundColor: 'rgb(51,65,85)',
            opacity: 0.8,
            inset: 0,
            position: 'fixed',
          },
          '.dialog_content': {
            position: 'fixed',
            top: '25%',
            right: '50%',
            transform: 'translate(50%,-20%)',
            width: '40vw',
            outline: 'none',
            height: '60vh',
          },
          '.line-chart-container': {
            display: 'grid',
            gridTemplateRows: 'min-content',
            gridTemplateColumns: 'minmax(0, 3fr) 1fr',
            width: '100%',
            gap: '1rem',
          },
          '.line-chart-container-mobile': {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            paddingBottom: '2rem',
          },
        }),
        addUtilities({
          'div[data-state=open]:hover > button': {
            'border-top-left-radius': '.25rem',
            'border-top-right-radius': '.25rem',
          },
          'div[data-state=open]:hover:has(button:hover:not(:focus))': {
            '--tw-ring-offset-shadow':
              'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
            '--tw-ring-shadow':
              'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
            'box-shadow':
              'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
          },
          'a.active': {
            boxShadow: '-.25rem 0 0 var(--tw-ring-color)',
          },
          '.shape-circle': {
            shapeOutside: 'circle(50%)',
            'clip-path': 'circle(50% at 50% 50%)',
          },
          '.fluid-text': {
            fontSize: 'calc(2.25rem + 20*(100vw - 20rem)/(1200 - 320))',
          },
          '.news-text': {
            width: '100%',
            height: '6rem',
            textOverflow: 'ellipsis',
          },
          '.news-wrapper': {
            display: 'flex',
            flexDirection: 'column',
            width: '22.5rem',
          },
          '.news-wrapper > img': {
            width: '100%',
            objectFit: 'contain',
          },
          '.news-wrapper:first-of-type > img': {
            marginBottom: '.75rem',
            order: 1,
          },
          '.news-wrapper:first-of-type > :first-child': {
            order: 2,
            margin: '0 0 .75rem 0',
          },
          '.news-wrapper:first-of-type > :last-child': {
            order: 3,
            margin: 0,
          },
        })
    }),
  ],
}
