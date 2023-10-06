import { useContext } from 'react';
import ToastContext from '../context/ToastContext';

export const useToastBarDispatch = () => {
  const { dispatchToast } = useContext(ToastContext);
  return dispatchToast;
};
