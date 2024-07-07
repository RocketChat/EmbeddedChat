import React, { useState } from 'react';
import {
  Box,
  ActionButton,
  Modal,
  Icon,
  Button,
  Tooltip,
  Menu,
  useComponentOverrides,
  appendClassNames,
} from '@embeddedchat/ui-elements';
import { EmojiPicker } from '../EmojiPicker';
import { parseEmoji } from '../../lib/emoji';
import { useMessageToolboxStyles } from './Message.styles';

export const MessageToolbox = ({
  className = '',
  message,
  variantStyles = {},
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
  optionConfig = {
    toolOptions: [
      'reaction',
      'reply',
      'quote',
      'star',
      'pin',
      'edit',
      'delete',
      'report',
    ],
    threshold: 8,
  },

  ...props
}) => {
  const { styleOverrides, classNames, configOverrides } = useComponentOverrides(
    'MessageToolbox',
    className,
    style
  );

  const styles = useMessageToolboxStyles();
  const toolOptions =
    configOverrides.optionConfig?.toolOptions || optionConfig.toolOptions;
  const threshold =
    configOverrides.optionConfig?.threshold || optionConfig.threshold;

  const [isEmojiOpen, setEmojiOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOnClose = () => {
    setShowDeleteModal(false);
  };

  const toolMap = {
    reply: !isThreadMessage && (
      <Tooltip text="Reply in thread" position="top" key="reply">
        <ActionButton
          ghost
          size="small"
          icon="thread"
          onClick={handleOpenThread(message)}
        />
      </Tooltip>
    ),
    quote: (
      <Tooltip text="Quote" position="top" key="quote">
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
        key="star"
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
      <Tooltip text="Add reaction" position="top" key="reaction">
        <ActionButton
          ghost
          size="small"
          icon="emoji"
          onClick={() => setEmojiOpen(true)}
        />
      </Tooltip>
    ),
    pin: !isThreadMessage && (
      <Tooltip text={message.pinned ? 'Unpin' : 'Pin'} position="top" key="pin">
        <ActionButton
          ghost
          size="small"
          icon={`${message.pinned ? 'pin-filled' : 'pin'}`}
          onClick={() => handlePinMessage(message)}
        />
      </Tooltip>
    ),
    edit: message.u._id === authenticatedUserId && (
      <Tooltip text="Edit" position="top" key="edit">
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
      <Tooltip text="Delete" position="top" key="delete">
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
      <Tooltip text="Report" position="top" key="report">
        <ActionButton
          ghost
          size="small"
          icon="report"
          type="destructive"
          onClick={() => handlerReportMessage(message)}
        />
      </Tooltip>
    ),
  };

  const menuOptions = toolOptions
    .slice(threshold)
    .map((key) => {
      const tool = toolMap[key];

      if (!tool) {
        return null;
      }

      const { onClick } = tool.props.children.props;
      const { icon } = tool.props.children.props;
      const { text } = tool.props;

      if (onClick && icon && text) {
        return {
          id: key,
          action: onClick,
          label: text,
          icon,
        };
      }

      return null;
    })
    .filter((option) => option !== null);

  return (
    <>
      <Box css={variantStyles.toolboxContainer || styles.toolboxContainer}>
        <Box
          css={styles.toolbox}
          className={appendClassNames('ec-message-toolbox', classNames)}
          style={styleOverrides}
          {...props}
        >
          {toolOptions.slice(0, threshold).map((key) => toolMap[key])}

          {menuOptions.length > 0 && (
            <Menu
              size="small"
              options={menuOptions}
              tooltip={{ isToolTip: true, position: 'top', text: 'More' }}
              useWrapper={false}
              style={{ top: 'auto', bottom: `calc(100% + 2px)` }}
            />
          )}

          {isEmojiOpen && (
            <EmojiPicker
              handleEmojiClick={(emoji) => {
                setEmojiOpen(false);
                handleEmojiClick(emoji, message, true);
              }}
              onClose={() => setEmojiOpen(false)}
              positionStyles={
                variantStyles.emojiPickerStyles || styles.emojiPickerStyles
              }
              wrapperId={`ec-message-body-${message._id}`}
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
