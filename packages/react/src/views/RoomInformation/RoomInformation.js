import React, { useContext } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Avatar,
  Sidebar,
  Popup,
  useComponentOverrides,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import getRoomInformationStyles from './RoomInformation.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);
  const styles = getRoomInformationStyles();
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const { variantOverrides } = useComponentOverrides('RoomMember');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  return (
    <ViewComponent
      title="Room Information"
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
          <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />
        </Box>
        <Box css={styles.infoContainer}>
          <Box css={styles.infoHeader}># {channelInfo.name}</Box>
          {channelInfo.description && (
            <>
              <Box css={styles.infoHeader}>Description</Box>
              <Box css={styles.info}>{channelInfo.description}</Box>
            </>
          )}
          {channelInfo.description && (
            <>
              <Box css={styles.infoHeader}>Topic</Box>
              <Box css={styles.info}>{channelInfo.topic}</Box>
            </>
          )}
          {channelInfo.description && (
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
