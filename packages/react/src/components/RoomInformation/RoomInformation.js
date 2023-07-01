import React, { useContext } from 'react';
import { Box, Icon, ActionButton, Avatar } from '@rocket.chat/fuselage';
import RCContext from '../../context/RCInstance';
import classes from './RoomInformation.module.css';
import { useChannelStore } from '../../store';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);

  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const toggleshowRoominfo = () => {
    setShowChannelinfo(false);
  };

  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };
  return (
    <Box className={classes.component} p="x16">
      <Box display="flex" is="h3">
        <Icon name="info" size="x24" padding="0px 20px 20px 0px" />
        <Box width="80%" style={{ color: '#4a4a4a' }}>
          Room Information
        </Box>
        <ActionButton
          onClick={toggleshowRoominfo}
          ghost
          display="inline"
          square
          small
        >
          <Icon name="cross" size="x20" />
        </ActionButton>
      </Box>

      <Avatar size="x332" url={getChannelAvatarURL(channelInfo.name)} />
      <Box m="x16">
        <Box marginBlock="x16" fontScale="h3">
          # {channelInfo.name}
        </Box>
        <Box marginBlock="x5" fontScale="p1">
          Description
        </Box>
        <Box fontScale="p1" opacity={0.5}>
          {channelInfo.description}
        </Box>
      </Box>
    </Box>
  );
};
export default Roominfo;
