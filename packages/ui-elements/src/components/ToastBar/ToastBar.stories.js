import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import { ToastBar, ToastBarProvider } from '.';
import DefaultTheme from '../../theme/DefaultTheme';
import { Button } from '../Button';
import { Box } from '../Box';
import useToastBarDispatch from '../../hooks/useToastBarDispatch';

export default {
  title: 'Components/ToastBar',
  component: ToastBar,
};

const ToastBarContainer = () => {
  const dispatchToast = useToastBarDispatch();
  return (
    <Box style={{ display: 'flex', gap: '0.2rem' }}>
      <Button
        onClick={() =>
          dispatchToast({
            message: 'Success Message',
            type: 'success',
          })
        }
        color="success"
      >
        Show Success Toast
      </Button>
      <Button
        type="destructive"
        onClick={() =>
          dispatchToast({
            message: 'Error Message',
            type: 'error',
          })
        }
      >
        Show Error Toast
      </Button>
      <Button
        color="info"
        onClick={() =>
          dispatchToast({
            message: 'Info Message',
            type: 'info',
          })
        }
      >
        Show Info Toast
      </Button>
      <Button
        color="warning"
        onClick={() =>
          dispatchToast({
            message: 'Warning Message',
            type: 'warning',
          })
        }
      >
        Show Warning Toast
      </Button>
    </Box>
  );
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <ToastBarProvider {...args}>
      <ToastBarContainer />
    </ToastBarProvider>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  position: 'bottom right',
};
