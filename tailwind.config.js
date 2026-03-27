/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:      '#000000',
        'surface-1':     '#08080D',
        'surface-2':     '#0F0F1A',
        'border-subtle': '#1A1A2E',
        'border-strong': '#26264A',
        'text-primary':  '#FFFFFF',
        'text-secondary':'#8899AA',
        'text-tertiary': '#4A5068',
        accent:          '#3D6EFF',
        success:         '#00D4A1',
        warning:         '#F5A623',
        danger:          '#FF4D6A',
        purple:          '#A855F7',
      },
      fontFamily: {
        sans:    ['var(--font-dm-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-geist-mono)', 'Courier New', 'monospace'],
      },
      borderRadius: {
        card:    '12px',
        'card-sm': '8px',
        pill:    '999px',
        input:   '999px',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        progressGrow: {
          '0%':   { width: '0%' },
          '85%':  { width: '88%' },
          '100%': { width: '95%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-up':       'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':       'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'float-slow':    'floatSlow 4s ease-in-out infinite',
        'float':         'float 4s ease-in-out infinite',
        marquee:         'marquee 40s linear infinite',
        'progress-grow': 'progressGrow 4000ms cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer:         'shimmer 2.5s linear infinite',
        'scale-in':      'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'scan-line':     'scanLine 3s linear infinite',
      },
    },
  },
  plugins: [],
}
