import { useReducer, useCallback } from 'react';

const initialState = {
  text: '',
  cursorPosition: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'SET_CURSOR':
      return { ...state, cursorPosition: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

/**
 * useChatInputState
 *
 * Manages the ChatInput's text and cursor position as structured state
 * instead of reading them directly from the DOM ref on every access.
 *
 * Key benefit: quote links are assembled at send-time via getFinalMarkdown(),
 * so they are never injected into the textarea value — preventing accidental
 * corruption while the user edits the message.
 */
const useChatInputState = () => {
  const [inputState, dispatch] = useReducer(reducer, initialState);

  const setText = useCallback(
    (text) => dispatch({ type: 'SET_TEXT', payload: text }),
    []
  );

  const setCursorPosition = useCallback(
    (pos) => dispatch({ type: 'SET_CURSOR', payload: pos }),
    []
  );

  const clearInput = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  /**
   * Builds the final markdown string to send.
   *
   * Quote links are resolved here, at send-time only, so the textarea always
   * contains just the user's plain text. This avoids the two bugs present in
   * the previous string-manipulation approach:
   *   1. Accumulated duplicates from mutating `quotedMessages` inside .map()
   *      and then joining the cumulative array values.
   *   2. Hidden markdown links being silently broken by cursor movement or
   *      editing inside the textarea.
   *
   * @param {string} text - The trimmed message text from the textarea
   * @param {Array}  quotes - Quote objects from the message store
   * @param {Function} getMessageLink - Async fn: (id) => permalink string
   * @returns {Promise<string>} Final markdown string ready to send
   */
  const getFinalMarkdown = useCallback(
    async (text, quotes, getMessageLink) => {
      if (!quotes || quotes.length === 0) return text;

      const quoteLinks = await Promise.all(
        quotes.map(async ({ _id, msg, attachments }) => {
          if (msg || attachments) {
            const link = await getMessageLink(_id);
            return `[ ](${link})`;
          }
          return '';
        })
      );

      const quotePart = quoteLinks.filter(Boolean).join('');
      return quotePart ? `${quotePart}\n${text}` : text;
    },
    []
  );

  return {
    inputState,
    setText,
    setCursorPosition,
    clearInput,
    getFinalMarkdown,
  };
};

export default useChatInputState;
