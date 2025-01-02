import { useCallback, useContext, useMemo } from 'react';
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
  const setDeleteMessageRoles = useMessageStore(
    (state) => state.setDeleteMessageRoles
  );
  const setDeleteOwnMessageRoles = useMessageStore(
    (state) => state.setDeleteOwnMessageRoles
  );
  const setForceDeleteMessageRoles = useMessageStore(
    (state) => state.setForceDeleteMessageRoles
  );
  const setUserPinPermissions = useUserStore(
    (state) => state.setUserPinPermissions
  );
  const setEditMessagePermissions = useMessageStore(
    (state) => state.setEditMessagePermissions
  );

  const createPermissionsMap = useMemo(
    () => (permissions) =>
      permissions.update.reduce((map, item) => {
        map[item._id] = item;
        return map;
      }, {}),
    []
  );

  const fetchAndSetPermissions = useCallback(async () => {
    try {
      const permissions = await RCInstance.permissionInfo();
      const permissionsMap = createPermissionsMap(permissions);

      setViewUserInfoPermissions(permissionsMap['view-full-other-user-info']);
      setDeleteMessageRoles(permissionsMap['delete-message']);
      setDeleteOwnMessageRoles(permissionsMap['delete-own-message']);
      setForceDeleteMessageRoles(permissionsMap['force-delete-message']);
      setUserPinPermissions(permissionsMap['pin-message']);
      setEditMessagePermissions(permissionsMap['edit-message']);

      return permissionsMap;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return null;
    }
  }, [
    RCInstance,
    createPermissionsMap,
    setViewUserInfoPermissions,
    setDeleteMessageRoles,
    setDeleteOwnMessageRoles,
    setForceDeleteMessageRoles,
    setUserPinPermissions,
    setEditMessagePermissions,
  ]);

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
        await fetchAndSetPermissions();
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

  return { getMessagesAndRoles, getStarredMessages };
};

export default useFetchChatData;
