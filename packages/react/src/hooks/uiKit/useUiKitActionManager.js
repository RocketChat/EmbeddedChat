import { useCallback, useContext } from 'react';
import { Emitter } from '@rocket.chat/emitter';
import RCContext from '../../context/RCInstance';
import useUiKitStore from '../../store/uiKitStore';

const emitter = new Emitter();

const useUiKitActionManager = () => {
  const { RCInstance } = useContext(RCContext);

  const { setIsUiKitModalOpen, setViewData } = useUiKitStore((state) => ({
    setIsUiKitModalOpen: state.setIsUiKitModalOpen,
    setViewData: state.setViewData,
  }));

  const disposeView = useCallback(() => {
    setIsUiKitModalOpen(false);
    setViewData(null);
  }, [setIsUiKitModalOpen, setViewData]);

  const handleServerInteraction = useCallback(
    (interaction) => {
      switch (interaction.type) {
        case 'modal.open':
        case 'contextual_bar.open':
          setViewData(interaction.view);
          setIsUiKitModalOpen(true);
          break;
        case 'modal.update':
        case 'contextual_bar.update': {
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
    const interaction = await RCInstance?.handleUiKitInteraction(
      appId,
      userInteraction
    );
    switch (userInteraction.type) {
      case 'viewSubmit':
        if (
          !!interaction &&
          !['errors', 'modal.update', 'contextual_bar.update'].includes(
            interaction.type
          )
        )
          disposeView();
        break;

      case 'viewClosed':
        if (!!interaction && interaction.type !== 'errors') disposeView();
        break;

      default:
        break;
    }
  };

  const on = useCallback((eventName, listener) => {
    emitter.on(eventName, listener);
    return () => emitter.off(eventName, listener);
  }, []);

  const off = useCallback((eventName, listener) => {
    emitter.off(eventName, listener);
  }, []);

  return { handleServerInteraction, emitInteraction, disposeView, on, off };
};

export default useUiKitActionManager;
