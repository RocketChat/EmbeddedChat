import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import { gridStyles as styles } from './Grid.styles';

import GridItem from './GridItem';

const Grid = ({
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
  ...props
}) => (
  <Box
    className="ec-grid"
    css={[
      styles.container,
      styles.dynamic(cols, gap, gapX, gapY, xs, md, lg, xl, xxl),
    ]}
    {...props}
  >
    {children}
  </Box>
);

Grid.Item = GridItem;

Grid.propTypes = {
  xs: PropTypes.shape({
    cols: PropTypes.number,
    gapX: PropTypes.string,
  }),
  md: PropTypes.shape({
    cols: PropTypes.number,
    gapX: PropTypes.string,
  }),
  lg: PropTypes.shape({
    cols: PropTypes.number,
    gapX: PropTypes.string,
  }),
  xl: PropTypes.shape({
    cols: PropTypes.number,
    gapX: PropTypes.string,
  }),
  xxl: PropTypes.shape({
    cols: PropTypes.number,
    gapX: PropTypes.string,
  }),
  cols: PropTypes.number,
  gap: PropTypes.string,
  gapX: PropTypes.string,
  gapY: PropTypes.string,
  children: PropTypes.node.isRequired,
};

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
