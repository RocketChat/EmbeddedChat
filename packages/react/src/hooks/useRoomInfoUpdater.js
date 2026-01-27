import { useEffect } from 'react';
import { useRCContext } from '../context/RCInstance';
import { useChannelStore } from '../store';

const useRoomInfoUpdater = () => {
  const { RCInstance } = useRCContext();
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);
  const setIsChannelPrivate = useChannelStore(
    (state) => state.setIsChannelPrivate
  );
  const setIsRoomTeam = useChannelStore((state) => state.setIsRoomTeam);
  const setIsChannelReadOnly = useChannelStore(
    (state) => state.setIsChannelReadOnly
  );

  useEffect(() => {
    const handleMessage = async (message) => {
      const roomUpdateTypes = [
        'r',
        'room_changed_description',
        'room_changed_announcement',
        'room_changed_topic',
        'room_changed_privacy',
        'room_changed_avatar',
      ];

      if (!roomUpdateTypes.includes(message.t)) {
        return;
      }

      try {
        const res = await RCInstance.channelInfo();
        if (res?.success) {
          setChannelInfo(res.room);
          setIsChannelPrivate(res.room.t === 'p');
          setIsRoomTeam(Boolean(res.room?.teamMain));
          setIsChannelReadOnly(Boolean(res.room.ro));
        }
      } catch (error) {
        console.error('Failed to update room info:', error);
      }
    };

    RCInstance.addMessageListener(handleMessage);
    return () => RCInstance.removeMessageListener(handleMessage);
  }, [
    RCInstance,
    setChannelInfo,
    setIsChannelPrivate,
    setIsRoomTeam,
    setIsChannelReadOnly,
  ]);
};

export default useRoomInfoUpdater;
