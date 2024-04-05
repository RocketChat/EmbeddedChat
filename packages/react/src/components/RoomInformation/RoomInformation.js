import React, { useContext, useEffect, useState } from 'react';
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
import { Throbber } from '../Throbber';

const channelSidebarCss = css`
  padding: 0 1rem 1rem;
  margin: 0 auto;
`;
const Roominfo = () => {
  const [isLeaveModal, setIsLeaveModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isUserInfoFetched, setIsUserInfoFetched] = useState(false);

  const { RCInstance, ECOptions } = useContext(RCContext);

  const channelInfo = useChannelStore((state) => state.channelInfo);

  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);

  const getChannelAvatarURL = (channelname) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${channelname}`;
  };

  const handleLeaveChannelModal = (e) => {
    console.log(e);
    setIsLeaveModal(true);
  };

  const handleDeleteChannelModal = e => {
    setIsDeleteModal(true);
  }

  const handleOnCloseLeaveModal = () => {
    setIsLeaveModal(false);
  };

  const handleOnCloseDeleteModal = () => {
    setIsDeleteModal(false);
  };

  const handleLeaveChannel = async () => {
    try {
      const res = await RCInstance.leaveChannel(isChannelPrivate);
      console.log('res', res);
      await RCInstance.logout();
    } catch (err) {
      console.error('Error leaving channel', err);
    }
  };

  const handleDeleteChannel = async () => {
    try {
      const res = await RCInstance.deleteChannel(isChannelPrivate);
      console.log('del', res);
    } catch (err) {
      console.error('Error deleting channel', err);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await RCInstance.me();
        setUserInfo(res);
        setIsUserInfoFetched(true);

      } catch (err) {
        console.error('Error fetching user information', err);
      }
    }

    getUserInfo();
  }, [RCInstance, setUserInfo, setIsUserInfoFetched]);

  const roles = userInfo && userInfo.roles ? userInfo.roles : [];
  const isAdmin = roles.includes('admin');

  return (
    <>
      <Sidebar
        title="Room Information"
        iconName="info"
        setShowWindow={setShowChannelinfo}
      >
        {isUserInfoFetched ? (
          <Box css={channelSidebarCss}>
            <Avatar size="100%" url={getChannelAvatarURL(channelInfo.name)} />
            <Box css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            margin-top: 15px;
            margin-bottom: 15px;
          `}>
              {isAdmin && (
                <Button
                  size='small'
                  color="secondary"
                  onClick={handleDeleteChannelModal}
                  css={css`
                margin: 5px;
              `}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon name="trash" size="1.25rem" style={{ padding: '0.25em' }} />
                    <span>Delete</span>
                  </div>
                </Button>
              )}

              <Button
                size='small'
                color="secondary"
                onClick={handleLeaveChannelModal}
                css={css`
                margin: 5px;
              `}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon name="room-leave" size="1.25rem" style={{ padding: '0.25em' }} />
                  <span>Leave</span>
                </div>
              </Button>
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
        ) : (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#4a4a4a',
            }}
          >
            <Throbber />
          </Box>
        )}
      </Sidebar>
      {isLeaveModal && (
        <Modal onClose={handleOnCloseLeaveModal}>
          <Modal.Header>
            <Modal.Title>
              <Icon
                name="report"
                size="1.25rem"
                style={{ marginRight: '0.5rem' }}
              />{' '}
              Are you sure?
            </Modal.Title>
            <Modal.Close onClick={handleOnCloseLeaveModal} />
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
            <Button color="secondary" onClick={handleOnCloseLeaveModal}>
              Cancel
            </Button>
            <Button
              color="error"
              onClick={() => {
                handleLeaveChannel();
                handleOnCloseLeaveModal();
              }}
            >
              Leave
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isDeleteModal && (
        <Modal onClose={handleOnCloseDeleteModal}>
          <Modal.Header>
            <Modal.Title>
              <Icon
                name="report"
                size="1.25rem"
                style={{ marginRight: '0.5rem' }}
              />{' '}
              Are you sure?
            </Modal.Title>
            <Modal.Close onClick={handleOnCloseDeleteModal} />
          </Modal.Header>
          <Modal.Content
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '0 0.5rem 0.5rem',
            }}
          >
            {parseEmoji(`Deleting a room will delete all messages within the room. This cannot be undone.`)}
          </Modal.Content>
          <Modal.Footer>
            <Button color="secondary" onClick={handleOnCloseDeleteModal}>
              Cancel
            </Button>
            <Button
              color="error"
              onClick={() => {
                handleDeleteChannel();
                handleOnCloseDeleteModal();
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
export default Roominfo;
