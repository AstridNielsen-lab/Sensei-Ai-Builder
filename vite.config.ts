import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          editor: ['@monaco-editor/react', 'monaco-editor'],
          router: ['react-router-dom']
        }
      }
    }
  },
  base: '/',
  server: {
    host: true,
    port: 3000,
    // Configuração SPA para desenvolvimento
    historyApiFallback: {
      index: '/index.html',
    },
  },
  preview: {
    host: true,
    port: 3000
  },
  // Configurações para roteamento SPA
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  }
});
