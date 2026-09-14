import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { contentValidationPlugin } from './scripts/content-validation';
export default defineConfig({
  plugins: [contentValidationPlugin(), react()],
  build: { rollupOptions: { output: { manualChunks: { 'material-color': ['@material/material-color-utilities'] } } } },
  server: { proxy: { '/api': 'http://127.0.0.1:3001' } },
});
