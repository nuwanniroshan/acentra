import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AuroraDesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/lab',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        'lucide-react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@mui/material': 'MaterialUI',
          '@mui/lab': 'MaterialUILab',
          '@mui/icons-material': 'MaterialUIIcons',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          'lucide-react': 'LucideReact',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});