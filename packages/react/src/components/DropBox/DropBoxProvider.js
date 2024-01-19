// DropBoxProvider.js

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import PropTypes from 'prop-types';

// export const DropBoxContext = createContext();


const DropBoxProvider = ({ children }) => {

   const data = useAttachmentWindowStore((state) => state.data);
   const setData = useAttachmentWindowStore((state) => state.setData);
   const toggle = useAttachmentWindowStore((state) => state.toggle);

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

   // const value = {
   //    onDrag,
   //    data,
   //    setData,
   //    handleDrag,
   //    handleDragEnter,
   //    handleDragLeave,
   //    handleDragDrop
   // };

   return (
      <DropBoxContext.Provider value={{
         onDrag,
         data,
         setData,
         handleDrag,
         handleDragEnter,
         handleDragLeave,
         handleDragDrop
      }}>
         {children}
      </DropBoxContext.Provider>
   );
};

DropBoxProvider.propTypes = {
   children: PropTypes.node.isRequired,
};

// export const useDropBox = () => {
//    return useContext(DropBoxContext);
// };

export default DropBoxProvider;
