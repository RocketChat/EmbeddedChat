import { useReducer, useCallback, useEffect } from 'react';
import useMessageStore from '../store/messageStore';
import { chatInputReducer, ACTION_TYPES } from './ChatInputReducer';
import useDraftMessage from './useDraftMessage';

const initialState = {
  text: '',
  editMessage: {},
  attachments: [],
};

/**
 * Hook to manage Chat Input state, moving away from raw string manipulation.
 * This tracks "Logical" state like quotes and formatting separately from the raw text.
 */
export const useChatInputState = (messageRef, RCInstance) => {
  const [state, dispatch] = useReducer(chatInputReducer, initialState);
  const { text, attachments } = state;

  const {
    quoteMessage,
    clearQuoteMessages,
    removeQuoteMessage,
    editMessage: storeEditMessage,
    setEditMessage: setStoreEditMessage,
    setQuoteMessages,
  } = useMessageStore((s) => ({
    quoteMessage: s.quoteMessage,
    clearQuoteMessages: s.clearQuoteMessages,
    removeQuoteMessage: s.removeQuoteMessage,
    editMessage: s.editMessage,
    setEditMessage: s.setEditMessage,
    setQuoteMessages: s.setQuoteMessages,
  }));

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_EDIT_MESSAGE, payload: storeEditMessage });
  }, [storeEditMessage]);

  // Persist draft messages to localStorage for refresh/crash resilience
  useDraftMessage(RCInstance.rid, text, quoteMessage, {
    setText,
    setQuoteMessages,
  });

  const setText = useCallback(
    (newText, cursorPosition) => {
      dispatch({ type: ACTION_TYPES.SET_TEXT, payload: newText });
      if (messageRef.current) {
        messageRef.current.value = newText;
        if (cursorPosition !== undefined) {
          messageRef.current.focus();
          // Use setTimeout to ensure the DOM has updated
          setTimeout(() => {
            messageRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }, 0);
        }
      }
    },
    [messageRef]
  );

  const insertText = useCallback(
    (insertion) => {
      const input = messageRef.current;
      if (!input) return;

      const { selectionStart, selectionEnd } = input;
      dispatch({
        type: ACTION_TYPES.INSERT_TEXT,
        payload: { insertion, selectionStart, selectionEnd },
      });

      const newCursorPos = selectionStart + insertion.length;
      if (messageRef.current) {
        messageRef.current.focus();
        setTimeout(() => {
          messageRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }
    },
    [messageRef]
  );

  const formatSelection = useCallback(
    (pattern) => {
      const input = messageRef.current;
      if (!input) return;

      const { selectionStart = 0, selectionEnd = input.value.length } = input;
      dispatch({
        type: ACTION_TYPES.FORMAT_SELECTION,
        payload: { pattern, selectionStart, selectionEnd },
      });

      // Selection handling is tricky after state update, 
      // in a real app we might wait for the next render or use a ref.
      messageRef.current.focus();
    },
    [messageRef]
  );

  const getFinalMarkdown = useCallback(async () => {
    let quotedMarkdown = '';

    if (quoteMessage.length > 0) {
      const host = RCInstance.getHost();
      const res = await RCInstance.channelInfo();
      const channelName = res.room?.name;

      const quoteLinks = quoteMessage.map((quote) => {
        const { _id } = quote;
        const msgLink = `${host}/channel/${channelName}/?msg=${_id}`;
        return `[ ](${msgLink})`;
      });

      quotedMarkdown = quoteLinks.join('');
      return `${quotedMarkdown}\n${text}`;
    }

    return text;
  }, [quoteMessage, text, RCInstance]);

  return {
    text,
    setText,
    insertText,
    quotes: quoteMessage,
    removeQuote: removeQuoteMessage,
    clearQuotes: clearQuoteMessages,
    formatSelection,
    getFinalMarkdown,
    editMessage: storeEditMessage,
    setEditMessage: setStoreEditMessage,
    attachments,
    setAttachments: (files) =>
      dispatch({ type: ACTION_TYPES.SET_ATTACHMENTS, payload: files }),
    removeAttachment: (file) =>
      dispatch({ type: ACTION_TYPES.REMOVE_ATTACHMENT, payload: file }),
    clearAttachments: () => dispatch({ type: ACTION_TYPES.CLEAR_ATTACHMENTS }),
  };
};

export default useChatInputState;

