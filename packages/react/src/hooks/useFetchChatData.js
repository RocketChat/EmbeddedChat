import { useCallback, useContext, useRef, useMemo } from 'react';
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
  const setMessagesOffset = useMessageStore((state) => state.setMessagesOffset);
  const setAdmins = useMemberStore((state) => state.setAdmins);
  const permissionsRef = useRef(null);
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

  const setters = useMemo(
    () =>
      new Map([
        ['viewUserInfo', setViewUserInfoPermissions],
        ['deleteMessage', setDeleteMessageRoles],
        ['deleteOwnMessage', setDeleteOwnMessageRoles],
        ['forceDeleteMessage', setForceDeleteMessageRoles],
        ['userPin', setUserPinPermissions],
        ['editMessage', setEditMessagePermissions],
      ]),
    [
      setViewUserInfoPermissions,
      setDeleteMessageRoles,
      setDeleteOwnMessageRoles,
      setForceDeleteMessageRoles,
      setUserPinPermissions,
      setEditMessagePermissions,
    ]
  );

  const permissionKeys = useMemo(
    () =>
      new Map([
        ['viewUserInfo', 'view-full-other-user-info'],
        ['deleteMessage', 'delete-message'],
        ['deleteOwnMessage', 'delete-own-message'],
        ['forceDeleteMessage', 'force-delete-message'],
        ['userPin', 'pin-message'],
        ['editMessage', 'edit-message'],
      ]),
    []
  );

  const applyPermissions = useCallback(
    (permissionsMap) => {
      Array.from(permissionKeys).forEach(([key, permissionId]) => {
        const setter = setters.get(key);
        if (setter) {
          setter(permissionsMap.get(permissionId));
        }
      });
    },
    [permissionKeys, setters]
  );

  const createPermissionsMap = useCallback(
    (permissions) =>
      new Map(permissions.update.map((item) => [item._id, item])),
    []
  );
  const fetchAndSetPermissions = useCallback(async () => {
    try {
      const permissions = await RCInstance.permissionInfo();

      if (
        !permissionsRef.current ||
        JSON.stringify(permissions) !==
          JSON.stringify(permissionsRef.current.raw)
      ) {
        const permissionsMap = createPermissionsMap(permissions);

        permissionsRef.current = {
          map: permissionsMap,
        };

        applyPermissions(permissionsMap);
      }

      return permissionsRef.current.map;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return null;
    }
  }, [RCInstance, applyPermissions, createPermissionsMap]);

  const getMessagesAndRoles = useCallback(
    async (anonymousMode) => {
      try {
        if (!isUserAuthenticated && !anonymousMode) {
          return;
        }

        const { messages, count } = await RCInstance.getMessages(
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
          setMessagesOffset(count);
        }

        if (!isUserAuthenticated) {
          return;
        }

        if (showRoles) {
          const { roles } = await RCInstance.getChannelRoles(isChannelPrivate);
          const fetchedRoles = await RCInstance.getUserRoles();
          const fetchedAdmins = fetchedRoles?.result;

          const adminUsernames = fetchedAdmins?.map((user) => user.username);
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

  return {
    getMessagesAndRoles,
    getStarredMessages,
    fetchAndSetPermissions,
    permissionsRef,
  };
};

export default useFetchChatData;
