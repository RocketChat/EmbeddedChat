import { useState, useEffect } from 'react';
import { EmbeddedChatApi } from '@embeddedchat/api';

/**
 * Custom hook to resolve roomId from either explicit roomId or channelName.
 * Returns an object with:
 * - roomId: The resolved room ID, or null if resolution is pending/failed
 * - error: Error message if resolution failed, or null if successful/pending
 *
 * @param {string|null|undefined} roomId - Explicit room ID
 * @param {string|null|undefined} channelName - Channel name to resolve
 * @param {string} host - Rocket.Chat host URL
 * @param {Function} getToken - Token getter function
 * @param {Function} deleteToken - Token deleter function
 * @param {Function} saveToken - Token saver function
 * @param {boolean} isUserAuthenticated - Whether user is authenticated
 * @returns {{roomId: string|null, error: string|null}} - Resolved room ID and error state
 */
export const useRoomId = (
  roomId,
  channelName,
  host,
  getToken,
  deleteToken,
  saveToken,
  isUserAuthenticated
) => {
  const [resolvedRoomId, setResolvedRoomId] = useState(() => {
    if (roomId) {
      return { roomId, error: null };
    }
    return channelName
      ? { roomId: null, error: null }
      : { roomId: 'GENERAL', error: null };
  });

  useEffect(() => {
    const resolveRoomId = async () => {
      if (roomId) {
        setResolvedRoomId({ roomId, error: null });
        return;
      }

      if (channelName) {
        if (!isUserAuthenticated) {
          return;
        }

        try {
          const tempRCInstance = new EmbeddedChatApi(host, 'GENERAL', {
            getToken,
            deleteToken,
            saveToken,
          });
          const roomIdFromName = await tempRCInstance.getRoomIdByName(
            channelName
          );
          await tempRCInstance.close().catch(console.error);
          if (roomIdFromName) {
            setResolvedRoomId({ roomId: roomIdFromName, error: null });
          } else {
            setResolvedRoomId({
              roomId: null,
              error: `Channel "${channelName}" not found or you don't have access to it.`,
            });
          }
        } catch (error) {
          setResolvedRoomId({
            roomId: null,
            error: `Failed to resolve channel "${channelName}": ${
              error.message || 'Unknown error'
            }`,
          });
        }
      } else {
        setResolvedRoomId({ roomId: 'GENERAL', error: null });
      }
    };

    resolveRoomId();
  }, [
    roomId,
    channelName,
    host,
    getToken,
    deleteToken,
    saveToken,
    isUserAuthenticated,
  ]);

  return resolvedRoomId;
};
