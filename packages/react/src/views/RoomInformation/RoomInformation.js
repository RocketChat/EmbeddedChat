import React, { useContext } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Avatar,
  Sidebar,
  Popup,
  useComponentOverrides,
  Icon,
  useTheme,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import getRoomInformationStyles from './RoomInformation.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const Roominfo = () => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const { variantOverrides } = useComponentOverrides('RoomMember');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };
  const { channelName } = ECOptions ?? {};
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;
  const { theme, mode } = useTheme();
  const styles = getRoomInformationStyles(theme, mode);

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
          <Avatar
            size="100%"
            url={getChannelAvatarURL(channelInfo.name || channelName)}
          />
        </Box>
        <Box css={styles.infoContainer}>
          <Box css={styles.archivedRoomInfo}>
            <Icon
              name="report"
              size="1.25rem"
              fill={
                mode === 'light'
                  ? theme.colors.warning
                  : theme.colors.warningForeground
              }
            />
            <Box css={styles.archivedText}>Room Archived</Box>
          </Box>
          <Box css={styles.infoHeader}>
            <Icon
              name={isChannelPrivate ? 'lock' : 'hash'}
              size="1.25rem"
              css={css`
                vertical-align: middle;
                margin-right: 0.5rem;
                margin-bottom: 0.25rem;
              `}
            />
            {channelInfo.name || channelName}
          </Box>
          {channelInfo.description && (
            <>
              <Box css={styles.infoHeader}>Description</Box>
              <Box css={styles.info}>{channelInfo.description}</Box>
            </>
          )}
          {channelInfo.announcement && (
            <>
              <Box css={styles.infoHeader}>Announcement</Box>
              <Box css={styles.info}>{channelInfo.announcement}</Box>
            </>
          )}
          {channelInfo.topic && (
            <>
              <Box css={styles.infoHeader}>Topic</Box>
              <Box css={styles.info}>{channelInfo.topic}</Box>
            </>
          )}
        </Box>
      </Box>
    </ViewComponent>
  );
};
export default Roominfo;
