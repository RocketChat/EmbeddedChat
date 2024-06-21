import { useCallback } from 'react';
import { Emitter } from '@rocket.chat/emitter';
import useUiKitStore from '../../store/uiKitStore';

const emitter = new Emitter();

const useUiKitActionManager = () => {
  const { setIsUiKitModalOpen, setViewData } = useUiKitStore((state) => ({
    setIsUiKitModalOpen: state.setIsUiKitModalOpen,
    setViewData: state.setViewData,
  }));

  const handleAction = useCallback(
    (interaction) => {
      switch (interaction.type) {
        case 'modal.open':
          setViewData(interaction.view);
          setIsUiKitModalOpen(true);
          break;
        case 'modal.update': {
          const { type, triggerId, appId, view } = interaction;
          emitter.emit(view.id, {
            type,
            triggerId,
            viewId: view.id,
            appId,
            view,
          });
          break;
        }
        case 'modal.close':
          break;
        default:
          break;
      }
    },
    [setIsUiKitModalOpen, setViewData]
  );

  const on = useCallback((eventName, listener) => {
    emitter.on(eventName, listener);
    return () => emitter.off(eventName, listener);
  }, []);

  const off = useCallback((eventName, listener) => {
    emitter.off(eventName, listener);
  }, []);

  return { handleAction, on, off };
};

export default useUiKitActionManager;
