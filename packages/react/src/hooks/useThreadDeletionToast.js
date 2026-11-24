import { useEffect } from 'react';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';
import useMessageStore from '../store/messageStore';

const useThreadDeletionToast = () => {
  const dispatchToastMessage = useToastBarDispatch();

  useEffect(
    () =>
      useMessageStore.subscribe((state, previousState) => {
        if (
          previousState.isThreadOpen &&
          previousState.threadMainMessage &&
          !state.isThreadOpen &&
          state.threadMainMessage === null &&
          state.deletedMessage === previousState.threadMainMessage &&
          state.messages !== previousState.messages
        ) {
          dispatchToastMessage({
            type: 'info',
            message:
              'This thread was closed because its parent message was deleted.',
          });
        }
      }),
    [dispatchToastMessage]
  );
};

export default useThreadDeletionToast;
