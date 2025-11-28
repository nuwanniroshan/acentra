import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  base: '/',
  plugins: [
    react(),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
