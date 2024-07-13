import React from 'react';
import { Tooltip, ActionButton, Icon } from '@embeddedchat/ui-elements';

const SurfaceItem = ({ item }) => (
  <Tooltip text={item.label} position="bottom" key={item.id}>
    <ActionButton square ghost onClick={item.onClick}>
      <Icon name={item.iconName} size="1.25rem" />
    </ActionButton>
  </Tooltip>
);

export default SurfaceItem;
