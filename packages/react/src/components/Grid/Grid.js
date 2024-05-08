import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';

import GridItem from './GridItem';

const GridContainer = ({
  xs,
  md,
  lg,
  xl,
  xxl,
  cols,
  gap,
  gapX,
  gapY,
  children,
}) => (
  <Box
    css={css`
      display: grid;
      height: 100%;
      ${cols && `grid-template-columns: repeat(${cols}, 1fr);`}
      ${gap && `gap: ${gap};`}
      ${gapX && `column-gap: ${gapX};`}
      ${gapY && `row-gap: ${gapY};`}

      @media (max-width: 600px) {
        ${xs && xs.cols && `grid-template-columns: repeat(${xs.cols}, 1fr);`};
        ${xs && xs.gapX && `column-gap: ${xs.gapX};`};
      }

      @media (min-width: 600px) {
        ${md && md.cols && `grid-template-columns: repeat(${md.cols}, 1fr);`};
        ${md && md.gapX && `column-gap: ${md.gapX};`};
      }

      @media (min-width: 768px) {
        ${lg && lg.cols && `grid-template-columns: repeat(${lg.cols}, 1fr);`};
        ${lg && lg.gapX && `column-gap: ${lg.gapX};`};
      }

      @media (min-width: 992px) {
        ${xl && xl.cols && `grid-template-columns: repeat(${xl.cols}, 1fr);`};
        ${xl && xl.gapX && `column-gap: ${xl.gapX};`};
      }

      @media (min-width: 1200px) {
        ${xxl &&
        xxl.cols &&
        `grid-template-columns: repeat(${xxl.cols}, 1fr);`};
        ${xxl && xxl.gapX && `column-gap: ${xxl.gapX};`};
      }
    `}
  >
    {children}
  </Box>
);

const Grid = ({ xs, md, lg, xl, xxl, cols, gap, gapX, gapY, children }) => (
  <GridContainer
    xs={xs}
    md={md}
    lg={lg}
    xl={xl}
    xxl={xxl}
    cols={cols}
    gap={gap}
    gapX={gapX}
    gapY={gapY}
  >
    {children}
  </GridContainer>
);

Grid.Item = GridItem;

export default Grid;

// Example Usage

/* <Grid
  xs={{ cols: 1 }}
  md={{ cols: 3 }}
  lg={{ cols: 4 }}
  xl={{ cols: 5 }}
  xxl={{ cols: 6 }}
  gapX="10px"
  gapY="10px"
>
  <Grid.Item xs={{ colSpan: 1 }} md={{ colSpan: 2 }} xxl={{ colSpan: 3 }}>
    <Grid gap="10px" xs={{ cols: 1 }} gapX="5px">
      <Grid.Item>1.1</Grid.Item>
      <Grid.Item>1.2</Grid.Item>
    </Grid>
  </Grid.Item>
  <Grid.Item lg={{ colSpan: 2 }} xl={{ colSpan: 3 }}>
    2
  </Grid.Item>
  <Grid.Item lg={{ colSpan: 4 }} xl={{ colSpan: 3 }} xxl={{ colSpan: 4 }}>
    3
  </Grid.Item>
  <Grid.Item lg={{ colSpan: 4 }} xl={{ colSpan: 2 }}>
    4
  </Grid.Item>
  <Grid.Item lg={{ colSpan: 4 }} xl={{ colSpan: 2 }} xxl={{ colSpan: 6 }}>
    5
  </Grid.Item>
  <Grid.Item
    md={{ colSpan: 3 }}
    lg={{ colSpan: 4 }}
    xl={{ colSpan: 3 }}
    xxl={{ colSpan: 6 }}
  >
    6
  </Grid.Item>
</Grid>; */
