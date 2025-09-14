import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// Obtener el directorio actual (equivalente a __dirname en ESM)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración de base path
  base: '/',
  
  // Configuración de resolución de alias
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  
  // Configuración de build optimizada
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          styles: ['./src/styles/main.css']
        },
        // Optimización de nombres de archivos
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          // Mantener la estructura de directorios para favicons y webmanifest
          if (assetInfo.name.includes('favicon') || assetInfo.name.includes('site.webmanifest')) {
            return '[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    },
    // Generación de sourcemaps solo para producción
    sourcemap: false,
    // Comprimir archivos HTML
    assetsInlineLimit: 4096
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  
  // Configuración de preview
  preview: {
    port: 4173
  }
})
