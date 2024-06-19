import { useContext } from 'react';
import { SurfaceContext } from '../contexts/SurfaceContext';

export const useSurfaceType = () => useContext(SurfaceContext);
