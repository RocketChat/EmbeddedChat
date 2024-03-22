import { useCallback, useContext } from 'react';
import RCContext from '../context/RCInstance';
import {
  useUserStore,
  useChannelStore,
  useMemberStore,
  useMessageStore,
} from '../store';

const useFetchChatData = (showRoles) => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const setMemberRoles = useMemberStore((state) => state.setMemberRoles);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const setMessages = useMessageStore((state) => state.setMessages);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const getMessagesAndRoles = useCallback(
    async (anonymousMode) => {
      try {
        if (!isUserAuthenticated && !anonymousMode) {
          return;
        }

        const { messages } = await RCInstance.getMessages(
          anonymousMode,
          ECOptions?.enableThreads
            ? {
                query: {
                  tmid: {
                    $exists: false,
                  },
                },
              }
            : undefined,
          anonymousMode ? false : isChannelPrivate
        );

        if (messages) {
          setMessages(messages.filter((message) => message._hidden !== true));
        }

        if (!isUserAuthenticated) {
          // fetch roles only when the user is authenticated
          return;
        }

        if (showRoles) {
          const { roles } = await RCInstance.getChannelRoles(isChannelPrivate);

          // convert roles array from the API into an object for better search
          const rolesObj =
            roles?.length > 0
              ? roles.reduce(
                  (obj, item) => ({ ...obj, [item.u.username]: item }),
                  {}
                )
              : {};

          setMemberRoles(rolesObj);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      isUserAuthenticated,
      RCInstance,
      ECOptions?.enableThreads,
      showRoles,
      setMessages,
      setMemberRoles,
      isChannelPrivate,
    ]
  );

  return getMessagesAndRoles;
};

export default useFetchChatData;
