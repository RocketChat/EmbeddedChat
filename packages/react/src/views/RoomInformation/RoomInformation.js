import React, { useContext } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  Sidebar,
  Popup,
  useComponentOverrides,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import { MessageDivider } from '../Message/MessageDivider';

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
        <img size="100%" src={getChannelAvatarURL(channelInfo.name)} />
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
            <span>
              <Icon name="hash" size={'1rem'} />
            </span>
            {channelInfo.name}
          </Box>
          <MessageDivider />
          <Box
            css={css`
              margin-block: 5px;
              font-size: 1.1rem;
            `}
          >
            Description
          </Box>
          <Box
            css={css`
              opacity: 0.7;
            `}
          >
            {channelInfo.description}
          </Box>
          <MessageDivider />
          <Box
            css={css`
              margin-block: 5px;
              font-size: 1.1rem;
            `}
          >
            Anouncements
          </Box>
          <Box
            css={css`
              opacity: 0.7;
            `}
          >
            {channelInfo.announcement}
          </Box>
          <MessageDivider />
          <Box
            css={css`
              margin-block: 5px;
              font-size: 1.1rem;
            `}
          >
            Topic
          </Box>
          <Box
            css={css`
              opacity: 0.7;
            `}
          >
            {channelInfo.topic}
          </Box>
        </Box>
      </Box>
    </ViewComponent>
  );
};
export default Roominfo;
