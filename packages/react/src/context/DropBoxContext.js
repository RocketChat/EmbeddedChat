// import { createContext } from 'react';

// const DropBoxContext = createContext();

// export default DropBoxContext;

// DropBoxProvider.js

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const DropBoxContext = createContext();

export const useDropBox = () => {
   return useContext(DropBoxContext);
};

export const DropBoxProvider = ({ children }) => {

   const toggle = useAttachmentWindowStore((state) => state.toggle);
   const data = useAttachmentWindowStore((state) => state.data);
   const setData = useAttachmentWindowStore((state) => state.setData);

   const [onDrag, setOnDrag] = useState(false);
   const [leaveCount, setLeaveCount] = useState(0);

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

      toggle();
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
      handleDrag,
      handleDragEnter,
      handleDragLeave,
      handleDragDrop
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
