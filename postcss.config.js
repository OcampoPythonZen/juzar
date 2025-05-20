// PostCSS configuration with modern CSS features and optimizations
const path = require('path');

module.exports = (ctx) => ({
  // Use different config for production builds
  map: ctx.env === 'development' ? 'inline' : false,
  
  plugins: {
    // Import support with path resolution
    'postcss-import': {
      path: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src/css')
      ]
    },
    
    // Nesting support (CSS Nesting spec)
    'tailwindcss/nesting': {},
    
    // Tailwind CSS with JIT mode
    tailwindcss: {
      config: path.resolve(__dirname, 'tailwind.config.js'),
      // Enable JIT mode for faster builds in development
      mode: ctx.env === 'production' ? 'jit' : 'aot'
    },
    
    // Future CSS features
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'custom-selectors': true,
        'color-mod-function': true,
        'custom-properties': {
          preserve: true,
          warnings: true,
        },
        // Enable logical properties and values
        'logical-properties-and-values': true,
        // Enable prefers-color-scheme media query
        'prefers-color-scheme-query': true,
        // Enable focus-visible pseudo-class
        'focus-visible-pseudo-class': true,
      },
      // Enable CSS custom media queries
      importFrom: {
        customMedia: {
          '--viewport-sm': '(min-width: 640px)',
          '--viewport-md': '(min-width: 768px)',
          '--viewport-lg': '(min-width: 1024px)',
          '--viewport-xl': '(min-width: 1280px)',
        }
      }
    },
    
    // CSS minification in production
    ...(ctx.env === 'production' ? {
      'cssnano': {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          zindex: false, // Disable z-index optimization to prevent issues
          // Additional optimizations
          normalizeUrl: false,
          mergeLonghand: true,
          discardUnused: {
            fontFace: false, // Keep @font-face rules
            keyframes: false, // Keep @keyframes rules
          },
          // Don't minify CSS custom properties
          reduceIdents: {
            keyframes: false,
          },
        }],
      },
      // Optimize CSS with postcss-optimize
      'postcss-optimize': {
        cssnano: false, // We're using cssnano directly
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        zindex: false,
      },
    } : {}),
    
    // Autoprefixer with grid autoplacement support
    autoprefixer: {
      grid: 'autoplace',
      // Add vendor prefixes for the last 2 versions of major browsers
      // and browsers with > 1% market share
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11',
        'not op_mini all'
      ]
    },
    
    // Sort CSS properties for better compression and readability
    'postcss-sorting': {
      'properties-order': 'alphabetical',
      'unspecified-properties-position': 'bottom'
    },
    
    // Report CSS stats
    ...(process.env.NODE_ENV === 'analyze' ? {
      'postcss-reporter': {
        clearReportedMessages: true,
        noPlugin: true,
      },
      'postcss-browser-reporter': {}
    } : {})
  }
});
