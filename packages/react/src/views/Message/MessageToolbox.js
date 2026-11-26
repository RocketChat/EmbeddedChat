import React, { useState, useContext, useMemo, useRef, useId } from 'react';
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
import {
  GeneratedUiSurface,
  getGeneratedUiIcon,
  withGeneratedUiItems,
} from '@embeddedchat/ui-kit';
import RCContext from '../../context/RCInstance';
import { EmojiPicker } from '../EmojiPicker';
import { getMessageToolboxStyles } from './Message.styles';
import SurfaceMenu from '../SurfaceMenu/SurfaceMenu';
import { Markdown } from '../Markdown';
import Attachment from '../AttachmentHandler/Attachment';

export const MessageToolbox = ({
  className = '',
  message,
  variantStyles = {},
  style = {},
  isThreadMessage = false,
  authenticatedUserId,
  userRoles,
  pinRoles,
  deleteMessageRoles,
  deleteOwnMessageRoles,
  forceDeleteMessageRoles,
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
  const { RCInstance, ECOptions } = useContext(RCContext);
  const instanceHost = RCInstance.getHost();
  const generatedUiConfigurations = useMemo(
    () =>
      (ECOptions?.generatedUi || []).filter(({ placements }) =>
        placements.includes('messageToolbox')
      ),
    [ECOptions?.generatedUi]
  );
  const generatedUiAnchor = useRef(null);
  const generatedUiDialogId = useId();
  const { theme } = useTheme();
  const styles = getMessageToolboxStyles(theme);
  const surfaceItems =
    configOverrides.optionConfig?.surfaceItems || optionConfig.surfaceItems;
  const menuItems =
    configOverrides.optionConfig?.menuItems || optionConfig.menuItems;

  const [isEmojiOpen, setEmojiOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openGeneratedUiId, setOpenGeneratedUiId] = useState(null);

  const handleOnClose = () => {
    setShowDeleteModal(false);
  };

  const isAllowedToPin = userRoles.some((role) => pinRoles.has(role));

  const isAllowedToReport = message.u._id !== authenticatedUserId;

  const isAllowedToEditMessage = userRoles.some((role) =>
    editMessageRoles.has(role)
  )
    ? true
    : message.u._id === authenticatedUserId;

  const isAllowedToDeleteMessage = userRoles.some((role) =>
    deleteMessageRoles.has(role)
  );
  const isAllowedToDeleteOwnMessage = userRoles.some((role) =>
    deleteOwnMessageRoles.has(role)
  );
  const isAllowedToForceDeleteMessage = userRoles.some((role) =>
    forceDeleteMessageRoles.has(role)
  );

  const isVisibleForMessageType =
    message.files?.[0].type !== 'audio/mpeg' &&
    message.files?.[0].type !== 'video/mp4';

  const canDeleteMessage = isAllowedToForceDeleteMessage
    ? true
    : isAllowedToDeleteMessage
    ? true
    : isAllowedToDeleteOwnMessage
    ? message.u._id === authenticatedUserId
    : false;

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
        visible: isAllowedToEditMessage,
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
        visible: canDeleteMessage,
        type: 'destructive',
      },
      report: {
        label: 'Report',
        id: 'report',
        onClick: () => handlerReportMessage(message),
        iconName: 'report',
        visible: isAllowedToReport,
        type: 'destructive',
      },
      ...Object.fromEntries(
        generatedUiConfigurations.map((configuration) => {
          const itemId = `generated-ui-${configuration.id}`;
          return [
            itemId,
            {
              label: configuration.title || 'Generated UI',
              id: itemId,
              onClick: () =>
                setOpenGeneratedUiId((openId) =>
                  openId === configuration.id ? null : configuration.id
                ),
              iconName: getGeneratedUiIcon(configuration.componentType),
              visible: true,
              ariaProps: {
                'aria-haspopup': 'dialog',
                'aria-expanded': openGeneratedUiId === configuration.id,
                'aria-controls':
                  openGeneratedUiId === configuration.id
                    ? generatedUiDialogId
                    : undefined,
              },
            },
          ];
        })
      ),
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
      generatedUiConfigurations,
      openGeneratedUiId,
      generatedUiDialogId,
      canDeleteMessage,
      handleCopyMessageLink,
      isAllowedToEditMessage,
      isAllowedToReport,
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

  const surfaceOptions = withGeneratedUiItems(
    surfaceItems,
    menuItems,
    generatedUiConfigurations
  )
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          onClick: options[item].onClick,
          label: options[item].label,
          iconName: options[item].iconName,
          type: options[item].type,
          ariaProps: options[item].ariaProps,
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  const openGeneratedUiConfiguration = generatedUiConfigurations.find(
    (configuration) => configuration.id === openGeneratedUiId
  );

  return (
    <>
      <Box
        css={variantStyles.toolboxContainer || styles.toolboxContainer}
        data-generated-ui-open={Boolean(openGeneratedUiConfiguration)}
      >
        <Box
          ref={generatedUiAnchor}
          css={[
            styles.toolbox,
            generatedUiConfigurations.length > 0 && { position: 'relative' },
          ]}
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
          {openGeneratedUiConfiguration && (
            <GeneratedUiSurface
              open
              anchorRef={generatedUiAnchor}
              dialogId={generatedUiDialogId}
              roomId={message.rid || ECOptions?.roomId}
              messageId={message._id}
              onClose={() => setOpenGeneratedUiId(null)}
              configuration={openGeneratedUiConfiguration}
              placement="messageToolbox"
              onAction={ECOptions?.onGeneratedUiAction}
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
              overflow: 'scroll',
              whiteSpace: 'wrap',
              padding: '1rem',
              maxHeight: '50vh',
            }}
          >
            {message.file ? (
              message.file.type.startsWith('image/') ? (
                <div>
                  <img
                    src={
                      message.file?._id
                        ? `${instanceHost}/file-upload/${message.file._id}/${message.file.name}`
                        : null
                    }
                    alt={message.file.name}
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                  <div>{`${message.file.name} (${(
                    message.file.size / 1024
                  ).toFixed(2)} kB)`}</div>
                </div>
              ) : message.file.type.startsWith('video/') ? (
                <video
                  controls
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                >
                  <source
                    src={
                      message.file?._id
                        ? `${instanceHost}/file-upload/${message.file._id}/${message.file.name}`
                        : null
                    }
                    type={message.file.type}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : message.file.type.startsWith('audio/') ? (
                <audio controls style={{ maxWidth: '100%' }}>
                  <source
                    src={
                      message.file?._id
                        ? `${instanceHost}/file-upload/${message.file._id}/${message.file.name}`
                        : null
                    }
                    type={message.file.type}
                  />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <Markdown body={message} md={message.md} isReaction={false} />
              )
            ) : (
              <Markdown body={message} md={message.md} isReaction={false} />
            )}
            {message.attachments &&
              message.attachments.length > 0 &&
              message.msg &&
              message.msg[0] === '[' &&
              message.attachments.map((attachment, index) => (
                <Attachment
                  key={index}
                  attachment={attachment}
                  type={attachment.type}
                  host={instanceHost}
                />
              ))}
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
