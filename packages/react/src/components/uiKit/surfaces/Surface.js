import React from 'react';
import { SurfaceContext } from '../contexts/SurfaceContext';

export const Surface = ({ children, type }) => (
  <SurfaceContext.Provider value={type}>{children}</SurfaceContext.Provider>
);
