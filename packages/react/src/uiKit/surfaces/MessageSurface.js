import React from 'react';
import { Surface } from './Surface';
import { Box } from '../../components/Box';

const MessageSurface = ({ children }) => (
  <Surface type="message">
    <Box style={{ marginBlock: '1rem' }}>{children}</Box>
  </Surface>
);

export default MessageSurface;
