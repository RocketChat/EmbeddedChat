import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../Avatar/Avatar';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import { Box } from '../Box';
import Sidebar from '../Sidebar/Sidebar';

const Roominfo = () => {
  const { RCInstance } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);

  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  return (
    <Sidebar
      title="Room Information"
      iconName="info"
      setShowWindow={setShowChannelinfo}
    >
      <Box
        css={css`
          padding: 0 1rem 1rem;
          margin: 0 auto;
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
