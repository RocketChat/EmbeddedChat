// DropBoxProvider.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import DropBoxContext from '../context/DropBoxContext';
import PropTypes from 'prop-types';

export const useDropBox = () => {
   return useContext(DropBoxContext);
};

export const DropBoxProvider = ({ children }) => {
   const [onDrag, setOnDrag] = useState(false);
   const [leaveCount, setLeaveCount] = useState(0);
   const [data, setData] = useState(null);

   const handleDrag = (e) => {
      e.preventDefault();
   };

   const handleDragEnter = () => {
      setOnDrag(true);
   };

   const handleDragLeave = () => {
      if ((leaveCount % 2) === 1) {
         setOnDrag(false);
         setLeaveCount(leaveCount + 1);
      } else {
         setLeaveCount(leaveCount + 1);
      }
   };

   const handleDragDrop = (e) => {
      e.preventDefault();
      setOnDrag(false);
      setLeaveCount(0);
      setData(e.dataTransfer.files[0]);
   };

   useEffect(() => {
      document.addEventListener('dragover', handleDrag);
      document.addEventListener('drop', handleDragDrop);
      return () => {
         document.removeEventListener('dragover', handleDrag);
         document.removeEventListener('drop', handleDragDrop);
      };
   }, []);

   const value = {
      onDrag,
      data,
      setData,
      handleDragEnter,
      handleDragLeave,
   };

   return (
      <DropBoxContext.Provider value={value}>
         {children}
      </DropBoxContext.Provider>
   );
};

DropBoxProvider.propTypes = {
   children: PropTypes.node.isRequired,
};
