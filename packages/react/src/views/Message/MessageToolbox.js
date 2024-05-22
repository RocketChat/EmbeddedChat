import React, { useState } from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { ActionButton } from '../../components/ActionButton';
import { EmojiPicker } from '../EmojiPicker';
import { Modal } from '../../components/Modal';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { parseEmoji } from '../../lib/emoji';
import { Tooltip } from '../../components/Tooltip';
import { useMessageToolboxStyles } from './Message.styles';

export const MessageToolbox = ({
  className = '',
  message,
  style = {},
  isThreadMessage = false,
  authenticatedUserId,
  handleOpenThread,
  handleEmojiClick,
  handlePinMessage,
  handleStarMessage,
  handleDeleteMessage,
  handlerReportMessage,
  handleEditMessage,
  handleQuoteMessage,
  isEditing = false,
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageToolbox',
    className,
    style
  );
  const styles = useMessageToolboxStyles();

  const [isEmojiOpen, setEmojiOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOnClose = () => {
    setShowDeleteModal(false);
  };

  const handleClickDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <Box css={styles.container}>
        <Box
          css={styles.toolbox}
          className={appendClassNames('ec-message-toolbox', classNames)}
          style={styleOverrides}
          {...props}
        >
          {!isThreadMessage ? (
            <Tooltip text="Reply in thread" position="top">
              <ActionButton
                ghost
                size="small"
                icon="thread"
                onClick={handleOpenThread(message)}
              />
            </Tooltip>
          ) : null}

          <Tooltip text="Quote" position="top">
            <ActionButton
              ghost
              size="small"
              icon="quote"
              onClick={() => handleQuoteMessage(message)}
            />
          </Tooltip>

          <Tooltip
            text={
              message.starred &&
              message.starred.find((u) => u._id === authenticatedUserId)
                ? 'Remove star'
                : 'Star'
            }
            position="top"
          >
            <ActionButton
              ghost
              size="small"
              icon={`${
                message.starred &&
                message.starred.find((u) => u._id === authenticatedUserId)
                  ? 'star-filled'
                  : 'star'
              }`}
              onClick={() => handleStarMessage(message)}
            />
          </Tooltip>
          <Tooltip text="Add reaction" position="top">
            <ActionButton
              ghost
              size="small"
              icon="emoji"
              onClick={() => setEmojiOpen(true)}
            />
          </Tooltip>

          {isEmojiOpen && (
            <EmojiPicker
              handleEmojiClick={(emoji) => {
                setEmojiOpen(false);
                handleEmojiClick(emoji, message, true);
              }}
            />
          )}
          {/* <Popup
            modal
            open={isEmojiOpen}
            onClose={() => setEmojiOpen(false)}
            closeOnEscape
            contentStyle={popupStyle}
          ></Popup> */}
          {!isThreadMessage && (
            <Tooltip text={message.pinned ? 'Unpin' : 'Pin'} position="top">
              <ActionButton
                ghost
                size="small"
                icon={`${message.pinned ? 'pin-filled' : 'pin'}`}
                onClick={() => handlePinMessage(message)}
              />
            </Tooltip>
          )}
          {message.u._id === authenticatedUserId && (
            <>
              <Tooltip text="Edit" position="top">
                <ActionButton
                  ghost={!isEditing}
                  color={isEditing ? 'secondary' : 'default'}
                  size="small"
                  icon="edit"
                  onClick={() => handleEditMessage(message)}
                />
              </Tooltip>
              <Tooltip text="Delete" position="top">
                <ActionButton
                  ghost
                  size="small"
                  icon="trash"
                  type="destructive"
                  onClick={() => handleClickDelete(message)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip text="Report" position="top">
            <ActionButton
              ghost
              size="small"
              icon="report"
              type="destructive"
              onClick={() => handlerReportMessage(message)}
            />
          </Tooltip>
        </Box>
      </Box>
      {showDeleteModal && (
        <Modal onClose={handleOnClose}>
          <Modal.Header>
            <Modal.Title>
              <Icon
                name="trash"
                size="1.25rem"
                style={{ marginRight: '0.5rem' }}
              />{' '}
              Delete this message?
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
            {parseEmoji(message.msg)}
          </Modal.Content>
          <Modal.Footer>
            <Button type="secondary" onClick={handleOnClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteMessage(message);
                handleOnClose();
              }}
            >
              Delete message
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
