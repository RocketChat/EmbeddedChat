import { useContext } from 'react';
import ToastContext from '../context/ToastContext';

const useToastBarDispatch = () => {
  const { dispatchToast } = useContext(ToastContext);
  return dispatchToast;
};

export default useToastBarDispatch;
