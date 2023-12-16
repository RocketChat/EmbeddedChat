import React, { useState } from 'react';
import { css } from '@emotion/react';
import Popup from 'reactjs-popup';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { ActionButton } from '../ActionButton';
import { EmojiPicker } from '../EmojiPicker';
import { Modal } from '../Modal';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { parseEmoji } from '../../lib/emoji';
import { Tooltip } from "../Tooltip";
const MessageToolboxWrapperCss = css`
  display: none;
  .ec-message:hover & {
    display: flex;
    position: absolute;
    top: 0;
    right: 2rem;
    z-index: 1;
  }
`;

const MessageToolboxCss = css`
  display: flex;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-inline: -0.25rem;
  margin-top: 0.125rem;
  font-size: 1.25rem !important;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid #dfdfdf;
  border-radius: 0.25rem;

  background: #fff;
`;

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
  isEditing = false,
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageToolbox',
    className,
    style
  );

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
      <Box css={MessageToolboxWrapperCss}>
        <Box
          css={MessageToolboxCss}
          className={appendClassNames('ec-message-toolbox', classNames)}
          style={styleOverrides}
          {...props}
        >
          <Tooltip text="Thread" position="top" Y="-60%" X="-60%">
            {!isThreadMessage ? (
              <ActionButton
                ghost
                size="small"
                icon="thread"
                onClick={handleOpenThread(message)}
              />
            ) : null}
          </Tooltip >
          <Tooltip position="top" text="Star" Y="-60%" X="-55%">
            <ActionButton
              ghost
              size="small"
              icon={`${message.starred &&
                  message.starred.find((u) => u._id === authenticatedUserId)
                  ? 'star-filled'
                  : 'star'
                }`}
              onClick={() => handleStarMessage(message)}
            />
          </Tooltip>
          <Tooltip position="top" text="Emoji" Y="-60%" X="-55%">
            <ActionButton
              ghost
              size="small"
              icon="emoji"
              onClick={() => setEmojiOpen(true)}
            />
          </Tooltip>
          <Popup
            modal
            open={isEmojiOpen}
            onClose={() => setEmojiOpen(false)}
            closeOnEscape
            position="left center"
          >
            <EmojiPicker
              handleEmojiClick={(emoji) => {
                setEmojiOpen(false);
                handleEmojiClick(emoji, message, true);
              }}
            />
          </Popup>
          {!isThreadMessage && (
            <Tooltip position="top" text="Pin" Y="-60%" X="-55%">
              <ActionButton
                ghost
                size="small"
                icon="pin"
                onClick={() => handlePinMessage(message)}
              /></Tooltip>
          )}
          {message.u._id === authenticatedUserId && (
            <>
              <Tooltip position="top" text="Edit" Y="-60%" X="-55%">
                <ActionButton
                  ghost={!isEditing}
                  color={isEditing ? 'secondary' : 'default'}
                  size="small"
                  icon="edit"
                  onClick={() => handleEditMessage(message)}
                />
              </Tooltip>
              <Tooltip position="top" text="Delete" Y="-60%" X="-55%">
                <ActionButton
                  ghost
                  size="small"
                  icon="trash"
                  color="error"
                  onClick={() => handleClickDelete(message)}
                /></Tooltip>
            </>
          )}
          <Tooltip position="top" text="Report" Y="-60%" X="-55%">
            <ActionButton
              ghost
              size="small"
              icon="report"
              color="error"
              onClick={() => handlerReportMessage(message)}
            />
          </Tooltip>
        </Box>
      </Box>
      {showDeleteModal && (
        <Modal>
          <Modal.Header>
            <Modal.Title>
              <Icon name="trash" size="1.25rem" /> Delete this message?
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
            <Button color="secondary" onClick={handleOnClose}>
              Cancel
            </Button>
            <Button
              color="error"
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