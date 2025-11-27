import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  root: __dirname,
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'auth_frontend',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/pages/Login.tsx',
        './ForgotPassword': './src/pages/ForgotPassword.tsx',
        './ResetPassword': './src/pages/ResetPassword.tsx',
        './AuthProvider': './src/context/AuthContext.tsx',
      },
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
    port: 5174,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
    cors: true,
  },
});