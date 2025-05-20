import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createStyleImportPlugin } from 'vite-plugin-style-import';

// Vite configuration for WordPress theme development
export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isDevelopment = !isProduction;
  const isAnalyze = process.env.ANALYZE === 'true';
  
  // Base public path
  const base = isProduction ? './' : '/';
  
  // Image optimization options
  const imageOptimizerOptions = {
    jpg: { quality: 80 },
    png: { quality: 80 },
    webp: { quality: 80 },
    avif: { quality: 70 },
  };

  return {
    // Base configuration
    base,
    root: '.',
    publicDir: 'public',
    
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
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    
    // Build configuration
    build: {
      // Output directory
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: isDevelopment ? 'inline' : false,
      
      // Minification
      minify: isProduction ? 'terser' : false,
      
      // Chunk size warning limit (in kbs)
      chunkSizeWarningLimit: 1000,
      
      // Rollup options
      rollupOptions: {
        // Main entry points
        input: {
          main: resolve(__dirname, 'js/main.js'),
          styles: resolve(__dirname, 'css/main.css'),
        },
        // Output configuration
        output: {
          // Split vendor and app code
          manualChunks: {
            vendor: ['three'],
            gltf: ['three/examples/jsm/loaders/GLTFLoader.js'],
            controls: ['three/examples/jsm/controls/OrbitControls.js'],
          },
          // Consistent hashing
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            const ext = assetInfo.name.split('.').pop();
            
            // Handle CSS files
            if (['css', 'scss', 'sass', 'less', 'styl'].includes(ext)) {
              return 'css/[name].[hash][extname]';
            }
            
            // Handle font files
            if (['woff', 'woff2', 'ttf', 'eot', 'otf'].includes(ext)) {
              return 'fonts/[name].[hash][extname]';
            }
            
            // Handle image files
            if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif'].includes(ext)) {
              return 'images/[name].[hash][extname]';
            }
            
            // Default to assets directory
            return 'assets/[name].[hash][extname]';
          },
        },
      },
      
      // Performance optimizations
      target: 'es2015',
      cssTarget: 'chrome80',
      
      // Enable gzip/brotli compression
      reportCompressedSize: true,
      
      // Disable sourcemap for production
      sourcemap: isDevelopment,
      
      // Minify CSS
      cssMinify: isProduction,
      
      // Write files to disk in dev mode
      write: true,
    },
    
    // Development server configuration
    server: {
      port: 3000,
      strictPort: true,
      cors: true,
      open: true,
      
      // Configure Vite for WordPress theme development
      proxy: {
        '^/wp-content/.*\.(php|css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$': {
          target: env.VITE_WORDPRESS_URL || 'http://localhost',
          changeOrigin: true,
          secure: false,
        },
        '^/wp-admin/.*\.php$': {
          target: env.VITE_WORDPRESS_URL || 'http://localhost',
          changeOrigin: true,
          secure: false,
        },
        '^/wp-includes/.*': {
          target: env.VITE_WORDPRESS_URL || 'http://localhost',
          changeOrigin: true,
          secure: false,
        },
        '^/wp-json/.*': {
          target: env.VITE_WORDPRESS_URL || 'http://localhost',
          changeOrigin: true,
          secure: false,
        },
        '^/$': {
          target: env.VITE_WORDPRESS_URL || 'http://localhost',
          changeOrigin: true,
          secure: false,
        },
      },
      
      // Enable HMR
      hmr: {
        overlay: true,
      },
    },
    
    // Preview server configuration
    preview: {
      port: 3001,
      open: true,
    },
    
    // Plugins
    plugins: [
      // HTML processing
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: 'JUZAR Theme',
            description: 'Modern WordPress Theme',
            base,
          },
        },
      }),
      
      // Legacy browser support
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      
      // Image optimization
      ViteImageOptimizer({
        test: /\.(jpe?g|png|gif|svg|webp|avif)$/i,
        ...imageOptimizerOptions,
      }),
      
      // PWA support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'JUZAR Theme',
          short_name: 'JUZAR',
          description: 'Modern WordPress Theme',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      
      // Style imports
      createStyleImportPlugin({
        libs: [
          {
            libraryName: 'tailwindcss',
            esModule: true,
            resolveStyle: (name) => `tailwindcss/${name}`,
          },
        ],
      }),
      
      // Bundle analyzer
      isAnalyze && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    
    // Performance optimizations
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/GLTFLoader.js',
        'three/examples/jsm/controls/OrbitControls.js',
      ],
      exclude: [],
      esbuildOptions: {
        target: 'es2015',
      },
    },
    
    // Performance budget
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 250000,
      maxAssetSize: 250000,
      assetFilter: (assetFilename) => {
        return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
      },
    },
  };
});
