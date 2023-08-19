import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { Modal } from '.';
import DefaultTheme from '../../theme/DefaultTheme';
import { Box } from '../Box';
import { Button } from '../Button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Modal',
  component: Modal,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SimpleModal = {
  args: {},
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Modal
        open
        style={{
          maxWidth: '600px',
          maxHeight: '80vh',
        }}
      >
        <Modal.Header>
          <Modal.Title>Sample Title</Modal.Title>
          <Modal.Close tabIndex={-1} />
        </Modal.Header>
        <Modal.Content>
          <Box style={{ padding: '0.25rem', minHeight: '200px' }}>
            Content Will Appear here
          </Box>
        </Modal.Content>
        <Modal.Footer>
          <Button color="secondary">Cancel</Button>
          <Button color="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    </ThemeProvider>
  ),
};
