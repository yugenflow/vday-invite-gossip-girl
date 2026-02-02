import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.txt'],
  server: {
    port: 3004,
  },
});
