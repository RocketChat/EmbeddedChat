import { useCallback, useContext } from 'react';
import { Emitter } from '@rocket.chat/emitter';
import RCContext from '../../context/RCInstance';
import useUiKitStore from '../../store/uiKitStore';

const emitter = new Emitter();

const useUiKitActionManager = () => {
  const { setIsUiKitModalOpen, setViewData } = useUiKitStore((state) => ({
    setIsUiKitModalOpen: state.setIsUiKitModalOpen,
    setViewData: state.setViewData,
  }));

  const { RCInstance } = useContext(RCContext);

  const handleServerInteraction = useCallback(
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

  const emitInteraction = async (appId, userInteraction) => {
    await RCInstance?.handleUiKitInteraction(appId, userInteraction);
  };

  const on = useCallback((eventName, listener) => {
    emitter.on(eventName, listener);
    return () => emitter.off(eventName, listener);
  }, []);

  const off = useCallback((eventName, listener) => {
    emitter.off(eventName, listener);
  }, []);

  return { handleServerInteraction, emitInteraction, on, off };
};

export default useUiKitActionManager;
