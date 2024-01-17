// DropBoxProvider.js

import { useContext } from 'react';
import DropBoxContext from '../context/DropBoxContext';

export const useDropBox = () => {
   const context = useContext(DropBoxContext);
   if (!context) {
      throw new Error('useDropBox must be used within a DropBoxProvider');
   }
   return context;
};
