import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import svgIcons from './icons';
import useComponentOverrides from '../../hooks/useComponentOverrides';

const Icon = ({
  size = 24,
  name,
  className = '',
  style = {},
  color = 'currentColor',
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'Button',
    className,
    style
  );

  const IconComponent = useMemo(() => svgIcons[name], [name]);
  if (!name) {
    return null;
  }
  if (!IconComponent) {
    console.log(`No icon found for ${name}`);
    return null;
  }
  return (
    <IconComponent
      x="0"
      y="0"
      width={size}
      height={size}
      color={color}
      className={`ec-icon ${classNames}`}
      style={styleOverrides}
      {...props}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Icon;
