import React from 'react';
import SurfaceItem from './SurfaceItem';

const SurfaceMenu = ({ options, size = 'medium' }) => (
  <>
    {options?.map((item, idx) => (
      <SurfaceItem item={item} size={size} key={idx} />
    ))}
  </>
);

export default SurfaceMenu;
