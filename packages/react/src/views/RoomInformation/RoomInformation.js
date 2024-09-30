import React, { useContext, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Avatar,
  Sidebar,
  Popup,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);
  const { variantOverrides } = useComponentOverrides('RoomMember');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  const { theme } = useTheme();
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 780);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 780);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const viewComponentStyle = isSmallScreen
    ? {
        backgroundColor: theme.colors.background,
        position: 'absolute',
        width: '100%',
        left: 0,
        zIndex: 1,
      }
    : {
        backgroundColor: theme.colors.background,
        width: '100%',
        left: 0,
        zIndex: 1,
      };
  return (
    <ViewComponent
      title="Room Information"
      iconName="info"
      onClose={() => setExclusiveState(null)}
      style={viewComponentStyle}
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
        <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />
        <Box
          css={css`
            margin: 16px;
          `}
        >
          <Box
            css={css`
              margin-block: 16px;
              font-size: 1.25rem;
            `}
          >
            # {channelInfo.name}
          </Box>
          <Box
            css={css`
              margin-block: 5px;
            `}
          >
            Description
          </Box>
          <Box
            css={css`
              opacity: 0.5rem;
            `}
          >
            {channelInfo.description}
          </Box>
        </Box>
      </Box>
    </ViewComponent>
  );
};
export default Roominfo;
