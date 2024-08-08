import React from 'react';
import SurfaceItem from './SurfaceItem';
import { SortableContext } from '@dnd-kit/sortable';

const SurfaceMenu = ({ options, ...props }) => {
  return (
    <SortableContext items={options}>
      {options?.map((item, idx) => (
        <SurfaceItem {...item} key={idx} {...props} />
      ))}
    </SortableContext>
  );
};

export default SurfaceMenu;
