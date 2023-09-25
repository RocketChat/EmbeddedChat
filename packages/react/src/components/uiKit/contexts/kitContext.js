import { createContext, useContext } from 'react';

export const defaultContext = {
  action: console.log,
  state: console.log,
  appId: 'core',
  errors: {},
  values: {},
};

export const kitContext = createContext(defaultContext);

export const useUiKitContext = () => useContext(kitContext);

export const useUiKitStateValue = (actionId, initialValue) => {
  const { values, errors } = useUiKitContext();

  return {
    value: (values && values[actionId]?.value) ?? initialValue,
    error: errors && errors[actionId],
  };
};
