import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { ToastBar, ToastBarProvider } from '.';
import DefaultTheme from '../../theme/DefaultTheme';
import { Button } from '../Button';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';

export default {
  title: 'Components/ToastBar',
  component: ToastBar,
};

const ToastBarContainer = () => {
  const dispatchToast = useToastBarDispatch();
  return (
    <>
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
        color="error"
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
    </>
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
