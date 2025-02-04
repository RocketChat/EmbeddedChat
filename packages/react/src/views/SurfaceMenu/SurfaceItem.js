import React from 'react';
import { Tooltip, ActionButton } from '@embeddedchat/ui-elements';

const SurfaceItem = ({ item, size }) => (
  <Tooltip text={item.label} position="bottom" key={item.id}>
    <ActionButton
      square
      ghost
      onClick={item.onClick}
      icon={item.iconName}
      size={size}
      iconSize="small"
      color={item.type}
    />
  </Tooltip>
);

export default SurfaceItem;
