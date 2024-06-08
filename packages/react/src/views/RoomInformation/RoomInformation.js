import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../../components/Avatar/Avatar';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import { Box } from '../../components/Box';
import Sidebar from '../../components/Sidebar/Sidebar';
import Popup from '../../components/Popup/Popup';
import { useGlobalStyles } from '../EmbeddedChat.styles';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);
  const { scrollStyles } = useGlobalStyles();
  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  return (
    <Sidebar title="Room Information" iconName="info">
      <Box
        css={css`
          padding: 0 1rem 1rem;
          margin: 0 auto;
          overflow: auto;
          ${scrollStyles}
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
    </Sidebar>
  );
};
export default Roominfo;
