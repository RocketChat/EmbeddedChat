import React, { useContext } from 'react';
import { ActionButton, Avatar } from '@rocket.chat/fuselage';
import { css } from '@emotion/react';
import RCContext from '../../context/RCInstance';
import classes from './RoomInformation.module.css';
import { useChannelStore } from '../../store';
import { Icon } from '../Icon';
import { Box } from '../Box';

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
    <Box className={classes.component} style={{ padding: '16px' }}>
      <Box
        css={css`
          display: flex;
        `}
      >
        <h3 style={{ display: 'contents' }}>
          <Icon
            name="info"
            size="1.25rem"
            style={{ padding: '0px 20px 20px 0px' }}
          />
          <Box
            css={css`
              width: 100%;
              color: #4a4a4a;
            `}
          >
            Room Information
          </Box>
          <ActionButton
            onClick={toggleshowRoominfo}
            ghost
            display="inline"
            square
            small
          >
            <Icon name="cross" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>

      <Avatar size="x332" url={getChannelAvatarURL(channelInfo.name)} />
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
  );
};
export default Roominfo;
