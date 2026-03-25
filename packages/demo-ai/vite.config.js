import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolve ai-adapter from TypeScript source — no build step needed
      '@embeddedchat/ai-adapter': resolve(__dirname, '../ai-adapter/src/index.ts'),
    },
  },
  server: {
    port: 4000,
    open: true,
  },
});
