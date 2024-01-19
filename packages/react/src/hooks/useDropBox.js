// // DropBoxProvider.js

import { useContext } from 'react';
import DropBoxContext from '../context/DropBoxContext';

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import DropBoxContext from '../context/DropBoxContext';
// import PropTypes from 'prop-types';
// import DropBoxOverlay from '../components/DropBox/DropBoxOverlay';

// export const useDropBox = () => {
//    const { onDrag, setOnDrag, handleDrag, handleDragEnter, handleDragLeave, handleDragDrop } = useContext(DropBoxContext);


//    return {
//       onDrag: onDrag || false,
//       setOnDrag: setOnDrag || (() => { }),
//       handleDrag: handleDrag || (() => { }),
//       handleDragEnter: handleDragEnter || (() => { }),
//       handleDragLeave: handleDragLeave || (() => { }),
//       handleDragDrop: handleDragDrop || (() => { }),
//    };
// };

// // export const DropBoxProvider = ({ children }) => {

// //    const toggle = useAttachmentWindowStore((state) => state.toggle);

// //    const [onDrag, setOnDrag] = useState(false);
// //    const [leaveCount, setLeaveCount] = useState(0);
// //    const [data, setData] = useState(null);

// //    const handleDrag = (e) => {
// //       e.preventDefault();
// //    };

// //    const handleDragEnter = () => {
// //       setOnDrag(true);
// //    };

// //    const handleDragLeave = () => {
// //       if ((leaveCount % 2) === 1) {
// //          setOnDrag(false);
// //          setLeaveCount(leaveCount + 1);
// //       } else {
// //          setLeaveCount(leaveCount + 1);
// //       }
// //    };

// //    const handleDragDrop = (e) => {
// //       e.preventDefault();
// //       setOnDrag(false);
// //       setLeaveCount(0);

// //       toggle();
// //       setData(e.dataTransfer.files[0]);
// //    };

// //    useEffect(() => {
// //       document.addEventListener('dragover', handleDrag);
// //       document.addEventListener('drop', handleDragDrop);
// //       return () => {
// //          document.removeEventListener('dragover', handleDrag);
// //          document.removeEventListener('drop', handleDragDrop);
// //       };
// //    }, []);

// //    const value = {
// //       onDrag,
// //       data,
// //       setData,
// //       handleDrag,
// //       handleDragEnter,
// //       handleDragLeave,
// //    };

// //    return (
// //       <DropBoxContext.Provider value={value}>
// //          <DropBoxOverlay />
// //          {children}
// //       </DropBoxContext.Provider>
// //    );
// // };

// // DropBoxProvider.propTypes = {
// //    children: PropTypes.node.isRequired,
// // };



export const useDropBox = () => {
   return useContext(DropBoxContext);
};