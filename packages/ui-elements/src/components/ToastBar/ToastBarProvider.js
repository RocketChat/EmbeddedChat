import React, { useState, useCallback, useMemo } from 'react';
import ToastContext from '../../context/ToastContext';
import ToastContainer from './ToastContainer';

const ToastBarProvider = ({ position = 'bottom right', children }) => {
  const [toasts, setToasts] = useState([]);
  const dispatchToast = useCallback(
    (toast) => {
      const withId = {
        id: toast.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...toast,
      };
      setToasts((prevToasts) => [withId, ...prevToasts]);
    },
    [setToasts]
  );
  const contextValue = useMemo(
    () => ({
      toasts,
      dispatchToast,
      position,
      setToasts,
    }),
    [toasts, dispatchToast, position, setToasts]
  );
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default ToastBarProvider;
