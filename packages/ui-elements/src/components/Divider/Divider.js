import React from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import useDividerStyles from './Divider.styles';

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

Divider.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Divider;
