import React from 'react';
import SurfaceItem from './SurfaceItem';
import { Menu } from '@embeddedchat/ui-elements';

const ToolbarMenu = ({ options, size = 'small' }) => (
  <>
    {options?.map((item, idx) => {
      if (
        item.label !== 'Delete' &&
        item.label !== 'Pin' &&
        item.label !== 'Star' &&
        item.label !== 'Report' &&
        item.label !== 'Copy link' &&
        item.label !== 'Copy message'
      ) {
        return <SurfaceItem item={item} size={size} key={idx} />;
      }
    })}
    <Menu
      size="small"
      tooltip={{ isToolTip: true, position: 'top', text: 'Options' }}
      style={{ top: 'auto', bottom: `calc(100% + 2px)` }}
      options={options
        .map((item, idx) => {
          if (
            item.label === 'Delete' ||
            item.label === 'Pin' ||
            item.label === 'Star' ||
            item.label === 'Report' ||
            item.label === 'Copy link' ||
            item.label === 'Copy message'
          ) {
            return {
              id: item.id,
              action: item.onClick,
              label: item.label,
              icon: item.iconName,
            };
          }
          return null;
        })
        .filter((item) => item !== null)}
    />
  </>
);

export default ToolbarMenu;
