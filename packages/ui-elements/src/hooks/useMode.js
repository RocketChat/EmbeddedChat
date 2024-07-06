import React, { createContext, useContext, useMemo } from 'react';

const ModeContext = createContext();

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    return { mode: 'light' };
  }
  return context;
};

export const ModeProvider = ({ children, mode }) => {
  const defaultMode = mode || 'light';
  const memoizedMode = useMemo(() => ({ mode: defaultMode }), [defaultMode]);

  return (
    <ModeContext.Provider value={memoizedMode}>{children}</ModeContext.Provider>
  );
};
