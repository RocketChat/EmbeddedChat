import { createContext } from 'react';

export const UiKitContext = createContext({
  action: () => undefined,
  updateState: () => undefined,
  appId: 'core',
  values: {},
});
