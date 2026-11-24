import React, { useState } from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import { CheckBox } from '.';
import DefaultTheme from '../../theme/DefaultTheme';

export default {
  title: 'Components/CheckBox',
  component: CheckBox,
};

export const Default = {
  args: {
    defaultChecked: false,
    'aria-label': 'Example checkbox',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <CheckBox {...args} />
    </ThemeProvider>
  ),
};

const ControlledExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <ThemeProvider theme={DefaultTheme}>
      <CheckBox
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        aria-label="Controlled checkbox"
      />
    </ThemeProvider>
  );
};

export const Controlled = {
  render: () => <ControlledExample />,
};
