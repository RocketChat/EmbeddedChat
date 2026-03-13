export const ACTION_TYPES = {
  SET_TEXT: 'SET_TEXT',
  INSERT_TEXT: 'INSERT_TEXT',
  FORMAT_SELECTION: 'FORMAT_SELECTION',
  SET_EDIT_MESSAGE: 'SET_EDIT_MESSAGE',
  CLEAR_INPUT: 'CLEAR_INPUT',
};

export const chatInputReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_TEXT:
      return {
        ...state,
        text: action.payload,
      };

    case ACTION_TYPES.INSERT_TEXT: {
      const { insertion, selectionStart, selectionEnd } = action.payload;
      const newText =
        state.text.substring(0, selectionStart) +
        insertion +
        state.text.substring(selectionEnd);
      return {
        ...state,
        text: newText,
      };
    }

    case ACTION_TYPES.FORMAT_SELECTION: {
      const { pattern, selectionStart, selectionEnd } = action.payload;
      const initText = state.text.slice(0, selectionStart);
      const selectedText = state.text.slice(selectionStart, selectionEnd);
      const finalText = state.text.slice(selectionEnd);

      const startPattern = pattern.slice(0, pattern.indexOf('{{text}}'));
      const endPattern = pattern.slice(
        pattern.indexOf('{{text}}') + '{{text}}'.length
      );

      const isWrapped =
        initText.endsWith(startPattern) && finalText.startsWith(endPattern);

      let newValue;
      if (isWrapped) {
        newValue =
          initText.slice(0, initText.length - startPattern.length) +
          selectedText +
          finalText.slice(endPattern.length);
      } else {
        newValue = initText + startPattern + selectedText + endPattern + finalText;
      }

      return {
        ...state,
        text: newValue,
      };
    }

    case ACTION_TYPES.SET_EDIT_MESSAGE: {
      const message = action.payload;
      let text = '';
      if (message.attachments) {
        text = message.attachments[0]?.description || message.msg;
      } else if (message.msg) {
        text = message.msg;
      }
      return {
        ...state,
        text,
        editMessage: message,
      };
    }

    case ACTION_TYPES.CLEAR_INPUT:
      return {
        ...state,
        text: '',
        editMessage: {},
      };

    default:
      return state;
  }
};
