import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import FlexContainer from './FlexContainer';
import FlexItem from './FlexItem';
import { Box } from '../Box';

export default {
  title: 'Components/Flex',
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <FlexContainer {...args}>
      <FlexItem {...args}>
        <Box
          css={{ width: '100px', height: '50px', backgroundColor: 'lightblue' }}
        >
          Item 1
        </Box>
      </FlexItem>
      <FlexItem {...args}>
        <Box
          css={{
            width: '100px',
            height: '50px',
            backgroundColor: 'lightcoral',
          }}
        >
          Item 2
        </Box>
      </FlexItem>
      <FlexItem {...args}>
        <Box
          css={{
            width: '100px',
            height: '50px',
            backgroundColor: 'lightgreen',
          }}
        >
          Item 3
        </Box>
      </FlexItem>
    </FlexContainer>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  inline: false,
  direction: 'row',
  wrap: 'wrap',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'space-around',
  order: 0,
  grow: 1,
  shrink: 1,
  basis: 'auto',
  align: 'stretch',
};
