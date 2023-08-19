import { Margins } from '@rocket.chat/fuselage';
import React from 'react';
import { Surface } from './Surface';

const MessageSurface = ({ children }) => (
  <Surface type="message">
    <Margins blockEnd="x16">{children}</Margins>
  </Surface>
);

export default MessageSurface;
