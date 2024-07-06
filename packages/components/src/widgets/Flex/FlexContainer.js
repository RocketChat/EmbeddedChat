/* eslint-disable react/no-children-prop */
import React, { useMemo } from 'react';
import { Box } from '../Box';

function FlexContainer({
  inline = false,
  children,
  direction,
  wrap,
  alignItems,
  alignContent,
  justifyContent,
  style = {},
  ...props
}) {
  const containerStyle = useMemo(() => {
    if (inline !== undefined && style.display === undefined) {
      style.display = inline ? 'inline-flex' : 'flex';
    }

    if (direction !== undefined && style.flexDirection === undefined) {
      style.flexDirection = direction;
    }

    if (wrap !== undefined && style.flexWrap === undefined) {
      style.flexWrap = wrap === 'no-wrap' ? 'nowrap' : wrap;
    }

    if (alignItems !== undefined && style.alignItems === undefined) {
      style.alignItems =
        (alignItems === 'start' && 'flex-start') ||
        (alignItems === 'end' && 'flex-end') ||
        alignItems;
    }

    if (alignContent !== undefined && style.alignContent === undefined) {
      style.alignContent =
        (alignContent === 'start' && 'flex-start') ||
        (alignContent === 'end' && 'flex-end') ||
        alignContent;
    }

    if (justifyContent !== undefined && style.justifyContent === undefined) {
      style.justifyContent =
        (justifyContent === 'start' && 'flex-start') ||
        (justifyContent === 'end' && 'flex-end') ||
        justifyContent;
    }

    return style;
  }, [
    alignContent,
    alignItems,
    direction,
    inline,
    justifyContent,
    style,
    wrap,
  ]);

  return (
    <Box style={{ ...containerStyle }} {...props}>
      {' '}
      {children}{' '}
    </Box>
  );
}

export default FlexContainer;
