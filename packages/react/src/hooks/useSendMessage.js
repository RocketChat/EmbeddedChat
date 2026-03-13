import { useCallback } from 'react';
import { useMessageStore } from '../store';
import useAttachmentWindowStore from '../store/attachmentwindow';
import createPendingMessage from '../lib/createPendingMessage';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';

/**
 * @hook useSendMessage
 *
 * Encapsulates all the logic for sending, editing, and commanding messages.
 * This separates the "what to send" concern from the "how to compose" concern,
 * which was previously mixed inside ChatInput.js.
 *
 * This is a core part of the ChatInput state machine refactor, allowing the
 * send flow to be unit-tested independently of the UI component.
 */
export const useSendMessage = ({
  RCInstance,
  ECOptions,
  username,
  commands,
  threadId,
  getFinalMarkdown,
  setText,
  clearQuotes,
  setEditMessage,
  setDisableButton,
  setFilteredCommands,
  clearAttachments,
}) => {
  const dispatchToastMessage = useToastBarDispatch();

  const { upsertMessage, replaceMessage } = useMessageStore((state) => ({
    upsertMessage: state.upsertMessage,
    replaceMessage: state.replaceMessage,
  }));

  const { toggle, setData } = useAttachmentWindowStore((state) => ({
    toggle: state.toggle,
    setData: state.setData,
  }));

  /**
   * Logs the user out and dispatches an error toast.
   * Called when API responses indicate the session is invalid.
   */
  const handleSendError = useCallback(
    async (errorMessage) => {
      await RCInstance.logout();
      dispatchToastMessage({ type: 'error', message: errorMessage });
    },
    [RCInstance, dispatchToastMessage]
  );

  /**
   * Converts the current message text into a file attachment.
   * Used when the message exceeds the character limit.
   */
  const sendAsAttachment = useCallback(
    (text) => {
      const message = text.trim();
      setText('');
      setEditMessage({});
      const blob = new Blob([message], { type: 'text/plain' });
      const file = new File([blob], 'message.txt', {
        type: 'text/plain',
        lastModified: Date.now(),
      });
      toggle();
      setData(file);
    },
    [setText, setEditMessage, toggle, setData]
  );

  /**
   * Handles sending a brand-new message.
   * Uses getFinalMarkdown to combine quotes + text into the final server payload,
   * then optimistically adds a pending message while awaiting the server response.
   */
  const sendNewMessage = useCallback(
    async (userInfo) => {
      setText('');
      setDisableButton(true);

      const finalMessage = await getFinalMarkdown();
      const pendingMessage = createPendingMessage(finalMessage, userInfo);

      if (ECOptions.enableThreads && threadId) {
        pendingMessage.tmid = threadId;
      }

      upsertMessage(pendingMessage, ECOptions.enableThreads);

      const res = await RCInstance.sendMessage(
        { msg: pendingMessage.msg, _id: pendingMessage._id },
        ECOptions.enableThreads ? threadId : undefined
      );

      if (res.success) {
        clearQuotes();
        replaceMessage(pendingMessage._id, res.message);
      } else {
        await handleSendError('Failed to send message, please try again.');
      }
    },
    [
      RCInstance,
      ECOptions,
      threadId,
      getFinalMarkdown,
      setText,
      clearQuotes,
      setDisableButton,
      upsertMessage,
      replaceMessage,
      handleSendError,
    ]
  );

  /**
   * Handles updating an existing message.
   * Normalizes newlines before sending to ensure consistent rendering.
   */
  const sendEditedMessage = useCallback(
    async (editMessageId, messageText) => {
      setText('');
      setDisableButton(true);
      setEditMessage({});

      const res = await RCInstance.updateMessage(
        editMessageId,
        messageText.replace(/\n/g, '\\n')
      );

      if (!res.success) {
        await handleSendError('Error editing message, login again');
      }
    },
    [RCInstance, setText, setDisableButton, setEditMessage, handleSendError]
  );

  /**
   * Handles executing a slash command (e.g., /giphy, /leave).
   */
  const sendCommand = useCallback(
    async (message) => {
      const [rawCommand, ...paramsArray] = message.split(' ');
      const command = rawCommand.replace('/', '');
      const params = paramsArray.join(' ');

      const commandExists = commands.find((c) => c.command === command);
      if (!commandExists) return;

      setText('');
      setDisableButton(true);
      setEditMessage({});

      await RCInstance.execCommand({ command, params, tmid: threadId });
      setFilteredCommands([]);
    },
    [
      RCInstance,
      commands,
      threadId,
      setText,
      setDisableButton,
      setEditMessage,
      setFilteredCommands,
    ]
  );

  /**
   * Handles sending a file attachment.
   * Centralizes the attachment logic so it can be triggered from anywhere.
   */
  const sendFileAttachment = useCallback(
    async (file, fileName, description) => {
      setDisableButton(true);

      const res = await RCInstance.sendAttachment(
        file,
        fileName,
        description,
        ECOptions?.enableThreads ? threadId : undefined
      );

      if (res.success) {
        if (clearAttachments) clearAttachments();
      } else {
        await handleSendError('Failed to send attachment, please try again.');
      }
    },
    [
      RCInstance,
      ECOptions,
      threadId,
      setDisableButton,
      clearAttachments,
      handleSendError,
    ]
  );

  return {
    sendNewMessage,
    sendEditedMessage,
    sendCommand,
    sendAsAttachment,
    sendFileAttachment,
    handleSendError,
  };
};

export default useSendMessage;
