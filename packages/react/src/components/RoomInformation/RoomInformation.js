import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../Avatar/Avatar';
import RCContext from '../../context/RCInstance';
import { useChannelStore } from '../../store';
import { Box } from '../Box';
import Sidebar from '../Sidebar/Sidebar';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { parseEmoji } from '../../lib/emoji';
import { Button } from '../Button';

const channelSidebarCss = css`
  padding: 0 1rem 1rem;
  margin: 0 auto;
`;
const Roominfo = () => {
  const [isLeaveModal, setIsLeaveModal] = useState(false);
  const { RCInstance, ECOptions } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);

  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  const handleLeaveChannelModal = (e) => {
    console.log(e);
    setIsLeaveModal(true);
  }

  const handleOnClose = () => {
    setIsLeaveModal(false);
  };

  const handleLeaveChannel = async () => {
    const res = await RCInstance.leaveChannel();
    console.log('res', res);
    await RCInstance.logout();
  }

  return (
    <>
      <Sidebar
        title="Room Information"
        iconName="info"
        setShowWindow={setShowChannelinfo}
      >
        <Box css={channelSidebarCss}>
          <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />
          <Box css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1; // This will allow the Box to grow and take up available space
          margin-top: 20px; // Adjust the top margin as needed
          margin-bottom: 20px; // Adjust the bottom margin as needed
        `}>
            <ActionButton
              square
              color="secondary"
              onClick={handleLeaveChannelModal}
              css={css`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
            >
              <Icon name="room-leave" size="1.25rem" style={{ padding: '0.5em' }} />
            </ActionButton>
          </Box>

          <Box
            css={css`
              margin-block: 16px;
              font-size: 1.25rem;
              font-weight: bold;
            `}
          >
            # {channelInfo.name}
          </Box>
          {channelInfo?.description && (
            <>
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
            </>
          )}
        </Box>
      </Sidebar>
      {isLeaveModal && (
        <Modal onClose={handleOnClose}>
          <Modal.Header>
            <Modal.Title>
              <Icon
                name="report"
                size="1.25rem"
                style={{ marginRight: '0.5rem' }}
              />{' '}
              Are you sure?
            </Modal.Title>
            <Modal.Close onClick={handleOnClose} />
          </Modal.Header>
          <Modal.Content
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '0 0.5rem 0.5rem',
            }}
          >
            {parseEmoji(`Are you sure you want to leave the channel "${ECOptions.channelName}"`)}
          </Modal.Content>
          <Modal.Footer>
            <Button color="secondary" onClick={handleOnClose}>
              Cancel
            </Button>
            <Button
              color="error"
              onClick={() => {
                handleLeaveChannel();
                handleOnClose();
              }}
            >
              Leave
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
export default Roominfo;
