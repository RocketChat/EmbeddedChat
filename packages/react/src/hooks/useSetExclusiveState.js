import { useChatLayoutStore } from '../store';

const useSetExclusiveState = () => {
  const openExclusivePanel = useChatLayoutStore(
    (state) => state.openExclusivePanel
  );

  const setExclusiveState = (activeSetter) => {
    // Back-compat: old callers pass a setter; new code can pass a panel key string.
    if (typeof activeSetter === 'string' || activeSetter == null) {
      openExclusivePanel(activeSetter || null);
      return;
    }
    openExclusivePanel(null);
  };

  return setExclusiveState;
};

export default useSetExclusiveState;
