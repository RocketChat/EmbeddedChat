import { useCallback, useContext } from 'react';
import RCContext from '../context/RCInstance';
import {
  useUserStore,
  useChannelStore,
  useMemberStore,
  useMessageStore,
  useStarredMessageStore,
} from '../store';

const useFetchChatData = (showRoles) => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const setMemberRoles = useMemberStore((state) => state.setMemberRoles);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const setMessages = useMessageStore((state) => state.setMessages);
  const setAdmins = useMemberStore((state) => state.setAdmins);
  const setStarredMessages = useStarredMessageStore(
    (state) => state.setStarredMessages
  );
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setViewUserInfoPermissions = useUserStore(
    (state) => state.setViewUserInfoPermissions
  );
  const setMembersHandler = useMemberStore((state) => state.setMembersHandler);

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
          return;
        }

        if (showRoles) {
          const { roles } = await RCInstance.getChannelRoles(isChannelPrivate);
          const fetchedAdmins = await RCInstance.getUsersInRole('admin');
          const adminUsernames = fetchedAdmins?.users?.map(
            (user) => user.username
          );
          setAdmins(adminUsernames);

          const rolesObj =
            roles?.length > 0
              ? roles.reduce(
                  (obj, item) => ({ ...obj, [item.u.username]: item }),
                  {}
                )
              : {};

          setMemberRoles(rolesObj);
        }

        const permissions = await RCInstance.permissionInfo();
        setViewUserInfoPermissions(permissions.update[70]);
      } catch (e) {
        console.error(e);
      }
    },
    [
      isUserAuthenticated,
      RCInstance,
      ECOptions?.enableThreads,
      isChannelPrivate,
      showRoles,
      setMessages,
      setAdmins,
      setMemberRoles,
    ]
  );

  const getStarredMessages = useCallback(
    async (anonymousMode) => {
      if (isUserAuthenticated) {
        try {
          if (!isUserAuthenticated && !anonymousMode) {
            return;
          }
          const { messages } = await RCInstance.getStarredMessages();
          setStarredMessages(messages);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [isUserAuthenticated, RCInstance, setStarredMessages]
  );

  const getChannelMembers = useCallback(
    async (anonymousMode) => {
      if (isUserAuthenticated) {
        try {
          if (!isUserAuthenticated && !anonymousMode) {
            return;
          }
          const { members } = await RCInstance.getChannelMembers();
          setMembersHandler(members);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [RCInstance, setMembersHandler, isUserAuthenticated]
  );

  return { getMessagesAndRoles, getStarredMessages, getChannelMembers };
};

export default useFetchChatData;
