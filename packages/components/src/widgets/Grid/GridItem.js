import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import { gridItemStyles as styles } from './Grid.styles';

const GridItem = ({ xs, md, lg, xl, xxl, children, ...props }) => (
  <Box css={styles.dynamicItem(xs, md, lg, xl, xxl)} {...props}>
    {children}
  </Box>
);

GridItem.propTypes = {
  xs: PropTypes.shape({
    colSpan: PropTypes.number,
    rowSpan: PropTypes.number,
    colStart: PropTypes.number,
    colEnd: PropTypes.number,
    rowStart: PropTypes.number,
    rowEnd: PropTypes.number,
  }),
  md: PropTypes.shape({
    colSpan: PropTypes.number,
    rowSpan: PropTypes.number,
    colStart: PropTypes.number,
    colEnd: PropTypes.number,
    rowStart: PropTypes.number,
    rowEnd: PropTypes.number,
  }),
  lg: PropTypes.shape({
    colSpan: PropTypes.number,
    rowSpan: PropTypes.number,
    colStart: PropTypes.number,
    colEnd: PropTypes.number,
    rowStart: PropTypes.number,
    rowEnd: PropTypes.number,
  }),
  xl: PropTypes.shape({
    colSpan: PropTypes.number,
    rowSpan: PropTypes.number,
    colStart: PropTypes.number,
    colEnd: PropTypes.number,
    rowStart: PropTypes.number,
    rowEnd: PropTypes.number,
  }),
  xxl: PropTypes.shape({
    colSpan: PropTypes.number,
    rowSpan: PropTypes.number,
    colStart: PropTypes.number,
    colEnd: PropTypes.number,
    rowStart: PropTypes.number,
    rowEnd: PropTypes.number,
  }),
  children: PropTypes.node.isRequired,
};

export default GridItem;
