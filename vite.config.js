import { defineConfig } from 'vite';
import { resolve } from 'path';

// Vite configuration for WordPress theme development
// During development, we use Vite's dev server with HMR
// For production, we build to the assets directory

export default defineConfig({
  // Root of the project
  root: '.',
  
  // Base public path when served in development
  base: '',
  
  // Development server configuration
  server: {
    port: 3000,
    strictPort: true,
    cors: true,
    // Configure Vite for WordPress theme development
    // This tells Vite to rewrite the URLs to the WordPress site
    proxy: {
      '^(?!\/src\/|\/@vite\/|\/node_modules\/)': {
        target: 'http://your-wordpress-site.local', // Update this to your local WordPress URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Build configuration
  build: {
    // Output directory relative to the theme root
    outDir: 'dist',
    
    // Emit manifest so PHP can find the hashed files
    manifest: true,
    
    // Empty the output directory on build
    emptyOutDir: true,
    
    // Configure rollup options
    rollupOptions: {
      // Main entry point
      input: {
        main: resolve(__dirname, 'js/main.js'),
      },
      // Output configuration
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          // Organize assets in subdirectories
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].some(ext => assetInfo.name.endsWith(ext))) {
            return 'images/[name][extname]';
          }
          if (assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.woff2') || assetInfo.name.endsWith('.ttf') || assetInfo.name.endsWith('.eot')) {
            return 'fonts/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, './js'),
      '~': resolve(__dirname, './'),
    },
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
});
