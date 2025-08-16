import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // Target directory - Spring Boot's target/classes/static
  const outputDir = path.resolve(__dirname, '../Backend/travel-platform/target/classes/static');
  
  return {
    plugins: [react()],
    
    // Build configuration
    build: {
      outDir: outputDir,
      emptyOutDir: true, // Clean target directory before build
      sourcemap: !isProduction,
      
      rollupOptions: {
        output: {
          // Asset file naming
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1);
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images';
            }
            if (/css|scss/i.test(extType)) {
              extType = 'css';
            }
            if (/otf|woff|woff2|ttf/i.test(extType)) {
              extType = 'fonts';
            }
            
            return `${extType}/[name]${isProduction ? '-[hash]' : ''}[extname]`;
          },
          
          // Chunk file naming
          chunkFileNames: `js/[name]${isProduction ? '-[hash]' : ''}.js`,
          
          // Entry file naming
          entryFileNames: `js/[name]${isProduction ? '-[hash]' : ''}.js`,
          
          // Manual chunks for optimization
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            api: ['axios']
          }
        }
      },
      
      // Target modern browsers
      target: 'es2015',
      minify: isProduction ? 'esbuild' : false,
      cssCodeSplit: true
    },
    
    // Development server configuration
    server: {
      port: 3000,
      host: '0.0.0.0',
      open: false,
      
      // Proxy API calls to Spring Boot
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@styles': path.resolve(__dirname, 'src/styles')
      }
    },
    
    // Define global constants
    define: {
      __DEV__: !isProduction,
      __PROD__: isProduction
    }
  };
});