import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { isSameDay } from 'date-fns';
import {
  Box,
  Icon,
  Throbber,
  useTheme,
  Button,
  Modal,
  Input,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';
import isMessageLastSequential from '../../lib/isMessageLastSequential';
import { MessageBody } from '../Message/MessageBody';
import { MessageDivider } from '../Message/MessageDivider';
import LocalAIMessage from '../LocalAIMessage';

const MessageList = ({
  messages,
  loadingOlderMessages,
  isUserAuthenticated,
  hasMoreMessages,
  firstUnreadMessageId,
  catchUps = [],
  onDismissCatchUp,
}) => {
  const { RCInstance } = useContext(RCContext);
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const isMessageLoaded = useMessageStore((state) => state.isMessageLoaded);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const deleteMessageRoles = useMessageStore((state) => state.deleteMessageRoles.roles);
  const deleteOwnMessageRoles = useMessageStore(
    (state) => state.deleteOwnMessageRoles.roles
  );
  const forceDeleteMessageRoles = useMessageStore(
    (state) => state.forceDeleteMessageRoles.roles
  );
  const userId = useUserStore((state) => state.userId);
  const userRoles = useUserStore((state) => state.roles);
  const dispatchToastMessage = useToastBarDispatch();
  const { theme } = useTheme();
  const selectionMode = useMessageStore((state) => state.isBulkSelectMode);
  const selectedMessageIds = useMessageStore((state) => state.selectedMessageIds);
  const setSelectionMode = useMessageStore((state) => state.setBulkSelectMode);
  const clearBulkSelection = useMessageStore((state) => state.clearBulkSelection);
  const toggleSelectedMessageId = useMessageStore(
    (state) => state.toggleSelectedMessageId
  );
  const setSelectedMessageIds = useMessageStore(
    (state) => state.setSelectedMessageIds
  );
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  const filteredMessages = messages.filter((msg) => !msg.tmid);
  const selectedMessages = filteredMessages.filter((msg) =>
    selectedMessageIds.includes(msg._id)
  );

  const deleteRolesSet = useMemo(() => new Set(deleteMessageRoles || []), [
    deleteMessageRoles,
  ]);
  const deleteOwnRolesSet = useMemo(() => new Set(deleteOwnMessageRoles || []), [
    deleteOwnMessageRoles,
  ]);
  const forceDeleteRolesSet = useMemo(
    () => new Set(forceDeleteMessageRoles || []),
    [forceDeleteMessageRoles]
  );

  const canDeleteMessage = (msg) => {
    const isAllowedToForceDelete = (userRoles || []).some((role) =>
      forceDeleteRolesSet.has(role)
    );
    if (isAllowedToForceDelete) return true;

    const isAllowedToDelete = (userRoles || []).some((role) =>
      deleteRolesSet.has(role)
    );
    if (isAllowedToDelete) return true;

    const isAllowedToDeleteOwn = (userRoles || []).some((role) =>
      deleteOwnRolesSet.has(role)
    );
    return isAllowedToDeleteOwn && msg?.u?._id === userId;
  };

  const selectableMessageIds = filteredMessages
    .filter((msg) => canDeleteMessage(msg))
    .map((msg) => msg._id);
  const areAllDeletableSelected =
    selectableMessageIds.length > 0 &&
    selectableMessageIds.every((id) => selectedMessageIds.includes(id));

  const handleToggleSelectionMode = (nextState = null) => {
    const isNextState =
      typeof nextState === 'boolean' ? nextState : !selectionMode;
    if (isNextState) {
      setSelectionMode(true);
      return;
    }
    clearBulkSelection();
  };

  const handleToggleMessageSelect = (messageId, checked) => {
    if (checked && !selectionMode) {
      setSelectionMode(true);
    }
    toggleSelectedMessageId(messageId);
  };

  const handleBulkDelete = async () => {
    const allowedMessages = selectedMessages.filter((msg) => canDeleteMessage(msg));
    if (!allowedMessages.length) {
      dispatchToastMessage({
        type: 'error',
        message: 'No selected messages can be deleted',
      });
      return;
    }

    const results = await Promise.allSettled(
      allowedMessages.map((msg) => RCInstance.deleteMessage(msg._id))
    );

    let deletedCount = 0;
    let failedCount = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.success) {
        deletedCount += 1;
        removeMessage(allowedMessages[index]._id);
      } else {
        failedCount += 1;
      }
    });

    setShowBulkDeleteModal(false);
    clearBulkSelection();

    dispatchToastMessage({
      type: failedCount ? 'warning' : 'success',
      message: failedCount
        ? `Deleted ${deletedCount} message(s), failed ${failedCount}`
        : `Deleted ${deletedCount} message(s)`,
    });
  };

  const reportedMessage = messages.find((msg) => msg._id === messageToReport);

  return (
    <>
      {filteredMessages.length === 0 ? (
        <Box
          css={css`
            text-align: center;
            margin: auto;
          `}
        >
          <Icon name="thread" size="2rem" />
          <Box>
            {isMessageLoaded
              ? 'No messages'
              : 'Ready to chat? Login now to join the fun.'}
          </Box>
        </Box>
      ) : (
        <>
          {!hasMoreMessages && isUserAuthenticated && (
            <MessageBody
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 16px',
                zIndex: 10,
              }}
            >
              Start of conversation
            </MessageBody>
          )}
          {loadingOlderMessages && isUserAuthenticated && (
            <Box
              css={css`
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                padding: 8px 16px;
                z-index: 10;
              `}
            >
              <Throbber />
            </Box>
          )}
          {filteredMessages
            .slice()
            .reverse()
            .map((msg, index, arr) => {
              const prev = arr[index - 1];
              const next = arr[index + 1];

              if (!msg) return null;
              const newDay = isMessageNewDay(msg, prev);
              const sequential = isMessageSequential(msg, prev, 300);
              const lastSequential =
                sequential && isMessageLastSequential(msg, next);
              const showUnreadDivider =
                firstUnreadMessageId && msg._id === firstUnreadMessageId;

              return (
                <React.Fragment key={msg._id}>
                  {showUnreadDivider && (
                    <MessageDivider unread>Unread Messages</MessageDivider>
                  )}
                  <Box
                    css={css`
                      display: flex;
                      align-items: flex-start;
                      gap: 0.25rem;
                      position: relative;
                    `}
                  >
                    {selectionMode && (
                      <Box
                        css={css`
                          padding-top: 0.4rem;
                          min-width: 1.5rem;
                        `}
                      >
                        <Input
                          type="checkbox"
                          checked={selectedMessageIds.includes(msg._id)}
                          disabled={!canDeleteMessage(msg)}
                          onChange={(e) =>
                            handleToggleMessageSelect(msg._id, e.target.checked)
                          }
                          css={css`
                            width: 16px;
                            height: 16px;
                            min-width: 16px;
                            border: 1.5px solid ${theme.colors.border};
                            border-radius: 3px;
                            appearance: none;
                            background: transparent;
                            cursor: pointer;
                            margin: 0;

                            &:checked {
                              background: ${theme.colors.primary};
                              border-color: ${theme.colors.primary};
                              position: relative;
                            }

                            &:checked::after {
                              content: '';
                              position: absolute;
                              left: 4px;
                              top: 1px;
                              width: 4px;
                              height: 8px;
                              border: solid ${theme.colors.background};
                              border-width: 0 2px 2px 0;
                              transform: rotate(45deg);
                            }

                            &:disabled {
                              opacity: 0.4;
                              cursor: not-allowed;
                            }
                          `}
                        />
                      </Box>
                    )}
                    <Box
                      css={css`
                        width: 100%;
                      `}
                    >
                      <Message
                        message={msg}
                        newDay={newDay}
                        sequential={sequential}
                        lastSequential={lastSequential}
                        type="default"
                        showAvatar
                        showToolbox={!selectionMode}
                      />
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
          {catchUps.map((catchUp) => (
            <LocalAIMessage
              key={catchUp.id}
              catchUp={catchUp}
              onDismiss={onDismissCatchUp}
            />
          ))}
          {showReportMessage && (
            <MessageReportWindow
              messageId={messageToReport}
              message={reportedMessage}
            />
          )}
        </>
      )}
      {showBulkDeleteModal && (
        <Modal onClose={() => setShowBulkDeleteModal(false)}>
          <Modal.Header>
            <Modal.Title>Delete selected messages?</Modal.Title>
            <Modal.Close onClick={() => setShowBulkDeleteModal(false)} />
          </Modal.Header>
          <Modal.Content>
            You are about to delete {selectedMessageIds.length} selected message(s).
            This action cannot be undone.
          </Modal.Content>
          <Modal.Footer>
            <Button type="secondary" onClick={() => setShowBulkDeleteModal(false)}>
              Cancel
            </Button>
            <Button type="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {selectionMode && (
        <Box
          css={css`
            position: sticky;
            bottom: 0;
            z-index: 20;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-top: 1px solid ${theme.colors.border};
            background: ${theme.colors.background};
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
          `}
        >
          <Box
            css={css`
              font-size: 0.875rem;
              opacity: 0.85;
            `}
          >
            {selectedMessageIds.length} selected
          </Box>
          <Box
            css={css`
              display: flex;
              gap: 0.5rem;
            `}
          >
            <Button
              type="secondary"
              small
              onClick={() => {
                setSelectionMode(true);
                setSelectedMessageIds(
                  areAllDeletableSelected ? [] : selectableMessageIds
                );
              }}
            >
              {areAllDeletableSelected ? 'Deselect all' : 'Select all'}
            </Button>
            <Button type="secondary" small onClick={() => handleToggleSelectionMode(false)}>
              Cancel
            </Button>
            <Button
              type="destructive"
              small
              disabled={selectedMessageIds.length === 0}
              onClick={() => setShowBulkDeleteModal(true)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
  catchUps: PropTypes.arrayOf(PropTypes.object),
  onDismissCatchUp: PropTypes.func,
};

export default MessageList;
