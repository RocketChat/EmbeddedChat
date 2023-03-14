import React, { useContext, useState } from 'react';
import { Box, Icon, ActionButton, Avatar, Button } from '@rocket.chat/fuselage';
import RCContext from '../../context/RCInstance';
import classes from './RoomInformation.module.css';
import { useChannelStore } from '../../store';
import EditRoominfo from './EditRoomInfo/EditRoomInfo';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);
  const showEditChannel = useChannelStore((state) => state.showEditChannel);
  const toggleEditChannel = useChannelStore((state) => state.toggleEditChannel);

  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const toggleshowRoominfo = () => {
    setShowChannelinfo(false);
  };

  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/room/${channelname}`;
  };

  if (showEditChannel) return <EditRoominfo />;

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

      <Avatar
        size="x332"
        url={
          `${channelInfo.avatarETag}`.startsWith('data') ||
          `${channelInfo.avatarETag}`.startsWith(RCInstance.host)
            ? channelInfo.avatarETag
            : getChannelAvatarURL(
                `${channelInfo._id}?etag=${channelInfo.avatarETag}`
              )
        }
      />
      <Box m="x16">
        <Box display="flex" flexDirection="row" justifyContent="center">
          <Button onClick={toggleEditChannel}>
            <Icon name="pencil" marginInlineEnd="x5" size="x20" />
            Edit
          </Button>
        </Box>
        <Box marginBlock="x16" fontScale="h3">
          <Icon name="hash" size="x24" />
          <span style={{ marginLeft: '5px' }}>{channelInfo.name}</span>
        </Box>
        {channelInfo.description.length > 0 ? (
          <>
            <Box marginBlock="x5" fontScale="p1">
              Description
            </Box>
            <Box fontScale="p1" opacity={0.5}>
              {channelInfo.description}
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
};
export default Roominfo;
