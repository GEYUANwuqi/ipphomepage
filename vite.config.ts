import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { contentValidationPlugin } from './scripts/content-validation';
/** Every browser that understands unicode-range subsetting also reads woff2, so the legacy
 *  .woff sources in @fontsource's CSS only double the font bytes shipped in dist. */
function dropLegacyWoff(): Plugin {
  return {
    name: 'drop-legacy-woff',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('@fontsource') || !id.includes('.css')) return null;
      return code.replace(/,\s*url\([^)]+\.woff\)\s*format\('woff'\)/g, '');
    },
  };
}

export default defineConfig({
  plugins: [dropLegacyWoff(), contentValidationPlugin(), react()],
  build: {
    // Production CSP is font-src 'self'; Vite would otherwise inline sub-4KB subsets as data: URIs and get them blocked.
    assetsInlineLimit: (file: string) => (/\.(woff2?|ttf|otf|eot)$/i.test(file) ? false : undefined),
    rollupOptions: { output: { manualChunks: { 'material-color': ['@material/material-color-utilities'] } } },
  },
  server: { proxy: { '/api': 'http://127.0.0.1:3001' } },
});
