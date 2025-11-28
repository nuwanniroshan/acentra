import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'acentra_frontend',
      // remotes: {
      //   auth_frontend: 'http://localhost:5174/remoteEntry.js',
      // },
      shared: ['react', 'react-dom', 'react-router-dom', '@acentra/aurora-design-system'],
    }),
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
