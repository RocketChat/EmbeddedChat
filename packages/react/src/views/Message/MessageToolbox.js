import React, { useState, useMemo } from 'react';
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
import { Menu } from '../../components/Menu';
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
  order = [
    'reaction',
    'reply',
    'quote',
    'star',
    'pin',
    'edit',
    'delete',
    'report',
  ],
  threshold = 4,
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

  const toolMap = useMemo(
    () => ({
      reply: !isThreadMessage && (
        <Tooltip text="Reply in thread" position="top">
          <ActionButton
            ghost
            size="small"
            icon="thread"
            onClick={handleOpenThread(message)}
          />
        </Tooltip>
      ),
      quote: (
        <Tooltip text="Quote" position="top">
          <ActionButton
            ghost
            size="small"
            icon="quote"
            onClick={() => handleQuoteMessage(message)}
          />
        </Tooltip>
      ),
      star: (
        <Tooltip
          text={
            message.starred &&
            message.starred.find((u) => u._id === authenticatedUserId)
              ? 'Unstar'
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
      ),
      reaction: (
        <Tooltip text="Add reaction" position="top">
          <ActionButton
            ghost
            size="small"
            icon="emoji"
            onClick={() => setEmojiOpen(true)}
          />
        </Tooltip>
      ),
      pin: !isThreadMessage && (
        <Tooltip text={message.pinned ? 'Unpin' : 'Pin'} position="top">
          <ActionButton
            ghost
            size="small"
            icon={`${message.pinned ? 'pin-filled' : 'pin'}`}
            onClick={() => handlePinMessage(message)}
          />
        </Tooltip>
      ),
      edit: message.u._id === authenticatedUserId && (
        <Tooltip text="Edit" position="top">
          <ActionButton
            ghost={!isEditing}
            color={isEditing ? 'secondary' : 'default'}
            size="small"
            icon="edit"
            onClick={() => handleEditMessage(message)}
          />
        </Tooltip>
      ),
      delete: message.u._id === authenticatedUserId && (
        <Tooltip text="Delete" position="top">
          <ActionButton
            ghost
            size="small"
            icon="trash"
            type="destructive"
            onClick={() => setShowDeleteModal(true)}
          />
        </Tooltip>
      ),
      report: (
        <Tooltip text="Report" position="top">
          <ActionButton
            ghost
            size="small"
            icon="report"
            type="destructive"
            onClick={() => handlerReportMessage(message)}
          />
        </Tooltip>
      ),
    }),
    [
      isThreadMessage,
      message,
      authenticatedUserId,
      handleOpenThread,
      handleQuoteMessage,
      handleStarMessage,
      handlePinMessage,
      handleEditMessage,
      handlerReportMessage,
      setEmojiOpen,
      isEditing,
    ]
  );

  const menuOptions = useMemo(
    () =>
      order
        .slice(threshold)
        .map((key) => {
          const tool = toolMap[key];

          if (!tool) {
            return null;
          }

          const { onClick } = tool.props.children.props;
          const { icon } = tool.props.children.props;
          const { text } = tool.props;

          return {
            id: key,
            action: onClick,
            label: text,
            icon,
          };
        })
        .filter((option) => option !== null),
    [order, threshold, toolMap]
  );

  return (
    <>
      <Box css={styles.container}>
        <Box
          css={styles.toolbox}
          className={appendClassNames('ec-message-toolbox', classNames)}
          style={styleOverrides}
          {...props}
        >
          {order.slice(0, threshold).map((key) => toolMap[key])}

          {menuOptions.length > 0 && (
            <Menu
              size="small"
              options={menuOptions}
              tooltip={{ isToolTip: true, position: 'top', text: 'More' }}
            />
          )}

          {isEmojiOpen && (
            <EmojiPicker
              handleEmojiClick={(emoji) => {
                setEmojiOpen(false);
                handleEmojiClick(emoji, message, true);
              }}
              onClose={() => setEmojiOpen(false)}
              positionStyles={{
                position: 'absolute',
                top: '7rem',
                right: '1.5rem',
              }}
            />
          )}
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
              type="destructive"
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
