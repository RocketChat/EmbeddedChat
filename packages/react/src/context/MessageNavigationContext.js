import React, { createContext, useContext } from 'react';

export const MessageNavigationContext = createContext(null);

export const MessageNavigationProvider = ({ value, children }) => {
  return (
    <MessageNavigationContext.Provider value={value}>
      {children}
    </MessageNavigationContext.Provider>
  );
};

export const useMessageNavigation = () => {
  const ctx = useContext(MessageNavigationContext);
  if (!ctx) {
    throw new Error(
      'useMessageNavigation must be used within MessageNavigationProvider'
    );
  }
  return ctx;
};
