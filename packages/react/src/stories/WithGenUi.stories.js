import React from 'react';
import { fn } from '@storybook/test';
import { generatedUiPreview } from 'layout_editor/src/fixtures/generatedUiPreview';
import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/WithGenUi',
  component: EmbeddedChat,
};

export const WithGenUi = {
  render: (args) => <EmbeddedChat {...args} />,
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: false,
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    hideHeader: false,
    auth: { flow: 'PASSWORD' },
    dark: false,
    generatedUi: generatedUiPreview,
    onGeneratedUiAction: fn(),
  },
};
