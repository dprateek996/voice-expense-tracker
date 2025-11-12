/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Mist palette (teal/blue gradient)
        primary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4dd0e1',
          400: '#26a69a',
          500: '#0097a7',
          600: '#00838f',
          700: '#006064',
          800: '#004d5a',
          900: '#00363a',
        },
        dark: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4dd0e1',
          400: '#26a69a',
          500: '#0097a7',
          600: '#00838f',
          700: '#006064',
          800: '#004d5a',
          900: '#00363a',
        },
        // shadcn/ui compatible colors
        border: "hsl(265 80% 90%)",
        input: "hsl(265 80% 90%)",
        ring: "hsl(265 80% 60%)", // Purple ring
        background: "hsl(265 80% 8%)", // Deep purple background
        foreground: "hsl(265 80% 98%)",
        card: {
          DEFAULT: "hsl(265 80% 10%)",
          foreground: "hsl(265 80% 98%)"
        },
        popover: {
          DEFAULT: "hsl(265 80% 10%)",
          foreground: "hsl(265 80% 98%)"
        },
        muted: {
          DEFAULT: "hsl(265 80% 20%)",
          foreground: "hsl(265 40% 70%)"
        },
        accent: {
          DEFAULT: "hsl(265 80% 60%)", // Purple accent
          foreground: "hsl(265 80% 98%)"
        },
        destructive: {
          DEFAULT: "hsl(340 80% 40%)",
          foreground: "hsl(265 80% 98%)"
        },
      },
      backgroundImage: {
  'gradient-primary': 'linear-gradient(135deg, #80cbc4 0%, #004d5a 100%)',
  'gradient-orb': 'linear-gradient(135deg, #80cbc4 0%, #004d5a 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'ripple': 'ripple 3s ease-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'rotate-ring': 'rotateRing 4s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-in forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.8',
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '1',
          },
        },
        ripple: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(2.5)',
            opacity: '0',
          },
        },
        breathe: {
          '0%, 100%': { 
            opacity: '0.4',
            filter: 'blur(40px)',
          },
          '50%': { 
            opacity: '0.7',
            filter: 'blur(60px)',
          },
        },
        rotateRing: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
            fontFamily: {
              sans: ["Satoshi", "ui-sans-serif", "system-ui"],
              // ...existing font families...
            },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}