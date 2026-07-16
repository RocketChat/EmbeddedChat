import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  base: process.env.LAYOUT_EDITOR_BASE_URL || '/EmbeddedChat/layout_editor',
  resolve: {
    alias: {
      '@rocket.chat/message-parser': path.resolve(__dirname, '../../node_modules/@rocket.chat/message-parser/dist/messageParser.mjs'),
    },
  },
});
