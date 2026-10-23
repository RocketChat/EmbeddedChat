import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generatedUiPreviewSyncPlugin } from './generatedUiSync.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    generatedUiPreviewSyncPlugin(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  base: process.env.LAYOUT_EDITOR_BASE_URL || '/EmbeddedChat/layout_editor',
});
