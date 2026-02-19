import { useCallback, useContext } from 'react';
import { Emitter } from '@rocket.chat/emitter';
import RCContext from '../../context/RCInstance';
import useUiKitStore from '../../store/uiKitStore';
import {
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
  useThreadsMessageStore,
  useMentionsStore,
  usePinnedMessageStore,
  useStarredMessageStore,
  useFileStore,
  useUserStore,
  useSidebarStore,
} from '../../store';

const emitter = new Emitter();

const useUiKitActionManager = () => {
  const { RCInstance } = useContext(RCContext);

  const {
    setUiKitModalOpen,
    setUiKitContextualBarOpen,
    setUiKitModalData,
    setUiKitContextualBarData,
  } = useUiKitStore((state) => ({
    setUiKitModalOpen: state.setUiKitModalOpen,
    setUiKitContextualBarOpen: state.setUiKitContextualBarOpen,
    setUiKitModalData: state.setUiKitModalData,
    setUiKitContextualBarData: state.setUiKitContextualBarData,
  }));

  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);
  const setShowMembers = useMemberStore((state) => state.setShowMembers);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);
  const setShowPinned = usePinnedMessageStore((state) => state.setShowPinned);
  const setShowStarred = useStarredMessageStore(
    (state) => state.setShowStarred
  );
  const setShowAllThreads = useThreadsMessageStore(
    (state) => state.setShowAllThreads
  );
  const setShowAllFiles = useFileStore((state) => state.setShowAllFiles);
  const setShowMentions = useMentionsStore((state) => state.setShowMentions);
  const setShowCurrentUserInfo = useUserStore(
    (state) => state.setShowCurrentUserInfo
  );
  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const closeSidebarPanels = useCallback(() => {
    setShowMembers(false);
    setShowSearch(false);
    setShowPinned(false);
    setShowStarred(false);
    setShowAllThreads(false);
    setShowAllFiles(false);
    setShowMentions(false);
    setShowCurrentUserInfo(false);
    setShowChannelinfo(false);
  }, [
    setShowMembers,
    setShowSearch,
    setShowPinned,
    setShowStarred,
    setShowAllThreads,
    setShowAllFiles,
    setShowMentions,
    setShowCurrentUserInfo,
    setShowChannelinfo,
  ]);

  const disposeView = useCallback(() => {
    setUiKitModalOpen(false);
    setUiKitModalData(null);
    setUiKitContextualBarOpen(false);
    setUiKitContextualBarData(null);
    setShowSidebar(false);
  }, [
    setUiKitModalOpen,
    setUiKitModalData,
    setUiKitContextualBarOpen,
    setUiKitContextualBarData,
    setShowSidebar,
  ]);

  const handleServerInteraction = useCallback(
    (interaction) => {
      switch (interaction.type) {
        case 'modal.open':
          setUiKitModalData(interaction.view);
          setUiKitModalOpen(true);
          break;
        case 'contextual_bar.open':
          closeSidebarPanels();
          setUiKitContextualBarData(interaction.view);
          setUiKitContextualBarOpen(true);
          setShowSidebar(true);
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
    [
      setUiKitContextualBarData,
      setUiKitContextualBarOpen,
      setUiKitModalOpen,
      setUiKitModalData,
      closeSidebarPanels,
      setShowSidebar,
    ]
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

  return {
    handleServerInteraction,
    emitInteraction,
    disposeView,
    on,
    off,
  };
};

export default useUiKitActionManager;