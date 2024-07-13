import React from 'react';
import SurfaceItem from './SurfaceItem';

const SurfaceMenu = ({ options }) => (
  <>
    {options?.map((item, idx) => (
      <SurfaceItem item={item} key={idx} />
    ))}
  </>
);

export default SurfaceMenu;
