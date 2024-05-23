import React, { memo } from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import useDividerStyles from './Divider.styles';

// eslint-disable-next-line react/prop-types
const Divider = ({ className = '', style = {}, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('Divider');
  const styles = useDividerStyles();

  return (
    <hr
      css={styles.divider}
      className={`ec-divider ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default memo(Divider);
