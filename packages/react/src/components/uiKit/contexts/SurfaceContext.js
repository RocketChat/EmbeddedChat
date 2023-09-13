import { createContext, useContext } from 'react';

export const SurfaceContext = createContext('message');

export const useSurfaceType = () => useContext(SurfaceContext);
