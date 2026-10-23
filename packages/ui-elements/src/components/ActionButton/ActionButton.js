import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import getIconSize from './getIconSize';

const ActionButton = forwardRef(
  (
    {
      icon,
      size = 'medium',
      color = 'default',
      children,
      iconSize = {},
      ...props
    },
    ref
  ) => (
    <Button ref={ref} square size={size} type={color} {...props}>
      {children}
      <Icon name={icon} size={getIconSize(iconSize, size)} />
    </Button>
  )
);

ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  iconSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      small: PropTypes.bool,
      large: PropTypes.bool,
      size: PropTypes.string,
    }),
  ]),
};

export { getIconSize };
export default ActionButton;
