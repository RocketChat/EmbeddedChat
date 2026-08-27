import React from 'react';
import { OllamaAdapter } from '@embeddedchat/ai-adapter';
import { EmbeddedChat } from '..';

const OLLAMA_BASE_URL =
  process.env.STORYBOOK_OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.STORYBOOK_OLLAMA_MODEL || 'llama3.2:1b';

export default {
  title: 'EmbeddedChat/WithAIAdapter',
  component: EmbeddedChat,
};

export const WithAIAdapter = {
  loaders: [
    async () => ({
      adapter: new OllamaAdapter({
        baseUrl: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL,
      }),
    }),
  ],
  render: (args, { loaded }) =>
    React.createElement(EmbeddedChat, { ...args, aiAdapter: loaded.adapter }),
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: false,
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    auth: { flow: 'PASSWORD' },
    dark: false,
  },
};
