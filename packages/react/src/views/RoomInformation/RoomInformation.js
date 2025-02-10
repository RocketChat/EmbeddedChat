import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Avatar,
  Sidebar,
  Popup,
  useComponentOverrides,
  Icon,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import getRoomInformationStyles from './RoomInformation.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);
  const styles = getRoomInformationStyles();
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const isRoomTeam = useChannelStore((state) => state.isRoomTeam);
  const { variantOverrides } = useComponentOverrides('RoomMember');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const getChannelAvatarURL = (RoomId) => {
    const host = RCInstance.getHost();
    const etag =
      channelInfo && channelInfo.avatarETag
        ? `?etag=${channelInfo.avatarETag}`
        : '';
    const channelAvatarUrl = `${host}/avatar/room/${encodeURIComponent(
      RoomId
    )}${etag}`;
    return channelAvatarUrl;
  };

  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  return (
    <ViewComponent
      title={isRoomTeam ? 'Team Information' : 'Room Information'}
      iconName="info"
      onClose={() => setExclusiveState(null)}
      style={{ width: '400px', zIndex: window.innerWidth <= 780 ? 1 : null }}
      {...(viewType === 'Popup'
        ? {
            isPopupHeader: true,
          }
        : {})}
    >
      <Box
        css={css`
          padding: 0 1rem 1rem;
          margin: 0 auto;
          overflow: auto;
        `}
      >
        <Box
          css={css`
            width: 100%;
            display: flex;
            justify-content: center;
          `}
        >
          <Avatar size="100%" url={getChannelAvatarURL(RCInstance.rid)} />
        </Box>
        <Box css={styles.infoContainer}>
          <Box css={styles.infoHeader}>
            <Icon
              name={
                isRoomTeam ? 'team' : isChannelPrivate ? 'hash_lock' : 'hash'
              }
              size="1.25rem"
              css={css`
                vertical-align: middle;
                margin-right: 0.5rem;
              `}
            />
            {channelInfo.name}
          </Box>
          {channelInfo.description && (
            <>
              <Box css={styles.infoHeader}>Description</Box>
              <Box css={styles.info}>{channelInfo.description}</Box>
            </>
          )}
          {channelInfo.topic && (
            <>
              <Box css={styles.infoHeader}>Topic</Box>
              <Box css={styles.info}>{channelInfo.topic}</Box>
            </>
          )}
          {channelInfo.announcement && (
            <>
              <Box css={styles.infoHeader}>Announcement</Box>
              <Box css={styles.info}>{channelInfo.announcement}</Box>
            </>
          )}
        </Box>
      </Box>
    </ViewComponent>
  );
};
export default Roominfo;
