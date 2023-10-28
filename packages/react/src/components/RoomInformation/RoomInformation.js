import React, { useContext } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { css } from '@emotion/react';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const componentStyle = css`
  position: fixed;
  right: 0;
  top: 0;
  width: 350px;
  height: 100%;
  overflow-x: scroll;
  overflow-y: scroll;
  background-color: white;
  box-shadow: -1px 0px 5px rgb(0 0 0 / 25%);
  z-index: 100;
  padding: 16px;

  @media (max-width: 550px) {
    width: 100vw;
  }
`;

const roomInfoTitleStyle = css`
  display: flex;
`;

const roomInfoContainerStyle = css`
  display: flex;
  margin: 16px;
`;

const roomInfoHeaderStyle = css`
  display: flex;
  font-size: 1.25rem;
  margin-block: 16px;
`;

const roomInfoDescriptionStyle = css`
  margin-block: 5px;
`;

const roomInfoDescriptionText = css`
  opacity: 0.5;
`;

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
    <Box css={componentStyle}>
      <Box css={roomInfoTitleStyle}>
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
          <ActionButton onClick={toggleshowRoominfo} ghost size="small">
            <Icon name="cross" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>

      <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />
      <Box css={roomInfoContainerStyle}>
        <Box css={roomInfoHeaderStyle}># {channelInfo.name}</Box>
        <Box css={roomInfoDescriptionStyle}>Description</Box>
        <Box css={roomInfoDescriptionText}>{channelInfo.description}</Box>
      </Box>
    </Box>
  );
};
export default Roominfo;
