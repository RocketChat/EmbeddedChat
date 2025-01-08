import React, { useState, useMemo } from 'react';
import {
  Box,
  Modal,
  Icon,
  Button,
  Menu,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';
import { EmojiPicker } from '../EmojiPicker';
import { getMessageToolboxStyles } from './Message.styles';
import SurfaceMenu from '../SurfaceMenu/SurfaceMenu';
import { Markdown } from '../Markdown';

export const MessageToolbox = ({
  className = '',
  message,
  variantStyles = {},
  style = {},
  isThreadMessage = false,
  authenticatedUserId,
  userRoles,
  pinRoles,
  editMessageRoles,
  handleOpenThread,
  handleEmojiClick,
  handlePinMessage,
  handleStarMessage,
  handleDeleteMessage,
  handlerReportMessage,
  handleCopyMessage,
  handleCopyMessageLink,
  handleEditMessage,
  handleQuoteMessage,
  isEditing = false,
  optionConfig = {
    surfaceItems: [
      'reaction',
      'reply',
      'quote',
      'star',
      'copy',
      'link',
      'pin',
      'edit',
      'delete',
      'report',
    ],

    menuItems: [],
  },

  ...props
}) => {
  const { styleOverrides, classNames, configOverrides } = useComponentOverrides(
    'MessageToolbox',
    className,
    style
  );
  const { theme } = useTheme();
  const styles = getMessageToolboxStyles(theme);
  const surfaceItems =
    configOverrides.optionConfig?.surfaceItems || optionConfig.surfaceItems;
  const menuItems =
    configOverrides.optionConfig?.menuItems || optionConfig.menuItems;

  const [isEmojiOpen, setEmojiOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOnClose = () => {
    setShowDeleteModal(false);
  };

  const isAllowedToPin = userRoles.some((role) => pinRoles.has(role));

  const isAllowedToEditMessage = userRoles.some((role) =>
    editMessageRoles.has(role)
  )
    ? true
    : message.u._id === authenticatedUserId;

  const isVisibleForMessageType =
    message.files?.[0].type !== 'audio/mpeg' &&
    message.files?.[0].type !== 'video/mp4';

  const options = useMemo(
    () => ({
      reply: {
        label: 'Reply in thread',
        id: 'reply',
        onClick: handleOpenThread(message),
        iconName: 'thread',
        visible: !isThreadMessage,
      },
      quote: {
        label: 'Quote',
        id: 'quote',
        onClick: () => handleQuoteMessage(message),
        iconName: 'quote',
        visible: true,
      },
      star: {
        label:
          message.starred &&
          message.starred.find((u) => u._id === authenticatedUserId)
            ? 'Unstar'
            : 'Star',
        id: 'star',
        onClick: () => handleStarMessage(message),
        iconName:
          message.starred &&
          message.starred.find((u) => u._id === authenticatedUserId)
            ? 'star-filled'
            : 'star',
        visible: true,
      },
      reaction: {
        label: 'Add reaction',
        id: 'reaction',
        onClick: () => setEmojiOpen(true),
        iconName: 'emoji',
        visible: true,
      },
      pin: {
        label: message.pinned ? 'Unpin' : 'Pin',
        id: 'pin',
        onClick: () => handlePinMessage(message),
        iconName: message.pinned ? 'pin-filled' : 'pin',
        visible: isAllowedToPin,
      },
      edit: {
        label: 'Edit',
        id: 'edit',
        onClick: () => handleEditMessage(message),
        iconName: 'edit',
        visible: isAllowedToEditMessage && isVisibleForMessageType,
        color: isEditing ? 'secondary' : 'default',
        ghost: !isEditing,
      },
      copy: {
        label: 'Copy message',
        id: 'copy',
        onClick: () => handleCopyMessage(message),
        iconName: 'copy',
        visible: true,
      },
      link: {
        label: 'Copy link',
        id: 'link',
        onClick: () => handleCopyMessageLink(message),
        iconName: 'link',
        visible: true,
      },
      delete: {
        label: 'Delete',
        id: 'delete',
        onClick: () => setShowDeleteModal(true),
        iconName: 'trash',
        visible: message.u._id === authenticatedUserId,
        type: 'destructive',
      },
      report: {
        label: 'Report',
        id: 'report',
        onClick: () => handlerReportMessage(message),
        iconName: 'report',
        visible: true,
        type: 'destructive',
      },
    }),
    [
      handleOpenThread,
      message,
      isThreadMessage,
      authenticatedUserId,
      isEditing,
      handleQuoteMessage,
      handleStarMessage,
      handlePinMessage,
      handleEditMessage,
      handlerReportMessage,
      handleCopyMessage,
      isAllowedToPin,
    ]
  );

  const menuOptions = menuItems
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          action: options[item].onClick,
          label: options[item].label,
          icon: options[item].iconName,
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  const surfaceOptions = surfaceItems
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          onClick: options[item].onClick,
          label: options[item].label,
          iconName: options[item].iconName,
          type: options[item].type,
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
          {surfaceOptions?.length > 0 && (
            <SurfaceMenu options={surfaceOptions} size="small" />
          )}
          {menuOptions?.length > 0 && (
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
            <Markdown body={message} isReaction={false} />
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
