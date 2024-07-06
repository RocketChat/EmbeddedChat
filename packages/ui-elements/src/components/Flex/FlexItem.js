/* eslint-disable react/no-children-prop */
import React, { useMemo } from 'react';
import { Box } from '../Box';

function FlexItem({
  children,
  order,
  grow,
  shrink,
  basis,
  align,
  style = {},
  ...props
}) {
  const itemStyle = useMemo(() => {
    if (order !== undefined && style.order === undefined) {
      style.order = order;
    }

    if (grow !== undefined && style.flexGrow === undefined) {
      style.flexGrow = grow;
    }

    if (shrink !== undefined && style.flexShrink === undefined) {
      style.flexShrink = shrink;
    }

    if (basis !== undefined && style.flexBasis === undefined) {
      style.flexBasis = basis;
    }

    if (align !== undefined && style.alignSelf === undefined) {
      style.alignSelf =
        (align === 'start' && 'flex-start') ||
        (align === 'end' && 'flex-end') ||
        align;
    }

    return style;
  }, [align, basis, grow, order, shrink, style]);

  return (
    <Box style={{ ...itemStyle }} {...props}>
      {' '}
      {children}{' '}
    </Box>
  );
}

export default FlexItem;
