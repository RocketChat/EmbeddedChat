import { createContext } from 'react';

const RCContext = createContext(null);

export const RCInstanceProvider = RCContext.Provider;

export default RCContext;
