import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import Grid from './Grid';
import GridItem from './GridItem';

export default {
  title: 'Components/Grid',
  component: Grid,
  subcomponents: { GridItem },
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Grid {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  xs: { cols: 1 },
  md: { cols: 3 },
  lg: { cols: 4 },
  xl: { cols: 5 },
  xxl: { cols: 6 },
  gapX: '10px',
  gapY: '10px',
  children: (
    <>
      <GridItem
        xs={{ colSpan: 1 }}
        md={{ colSpan: 2 }}
        xxl={{ colSpan: 3 }}
        css={{ border: '1px solid red' }}
      >
        <Grid gap="10px" xs={{ cols: 1 }} gapX="5px">
          <GridItem css={{ border: '1px solid blue' }}>1.1</GridItem>
          <GridItem css={{ border: '1px solid green' }}>1.2</GridItem>
        </Grid>
      </GridItem>
      <GridItem
        lg={{ colSpan: 2 }}
        xl={{ colSpan: 3 }}
        css={{ border: '1px solid yellow' }}
      >
        2
      </GridItem>
      <GridItem
        lg={{ colSpan: 4 }}
        xl={{ colSpan: 3 }}
        xxl={{ colSpan: 4 }}
        css={{ border: '1px solid purple' }}
      >
        3
      </GridItem>
      <GridItem
        lg={{ colSpan: 4 }}
        xl={{ colSpan: 2 }}
        css={{ border: '1px solid orange' }}
      >
        4
      </GridItem>
      <GridItem
        lg={{ colSpan: 4 }}
        xl={{ colSpan: 2 }}
        xxl={{ colSpan: 6 }}
        css={{ border: '1px solid teal' }}
      >
        5
      </GridItem>
      <GridItem
        md={{ colSpan: 3 }}
        lg={{ colSpan: 4 }}
        xl={{ colSpan: 3 }}
        xxl={{ colSpan: 6 }}
        css={{ border: '1px solid pink' }}
      >
        6
      </GridItem>
    </>
  ),
};
