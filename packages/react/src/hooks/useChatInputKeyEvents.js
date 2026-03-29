import formatSelection from '../lib/formatSelection';

/**
 * useChatInputKeyEvents - A hook to manage custom keyboard event logic for the ChatInput.
 * Directly supports the GSoC 2026 'Accessibility (WCAG) & Keyboard Navigation' deliverable.
 */
const useChatInputKeyEvents = ({
  messageRef,
  editMessage,
  setDisableButton,
  setEditMessage,
  showCommandList,
  showMembersList,
  sendTypingStop,
  sendMessage,
  handleNewLine,
}) => {
  const onKeyDown = (e) => {
    switch (true) {
      case e.ctrlKey && e.code === 'KeyI': {
        e.preventDefault();
        formatSelection(messageRef, '_{{text}}_');
        break;
      }
      case e.ctrlKey && e.code === 'KeyB': {
        e.preventDefault();
        formatSelection(messageRef, '*{{text}}*');
        break;
      }
      case (e.ctrlKey || e.metaKey || e.shiftKey) && e.code === 'Enter':
        e.preventDefault();
        handleNewLine(e);
        break;
      case e.code === 'Escape':
        if (editMessage.msg || editMessage.attachments) {
          e.preventDefault();
          messageRef.current.value = '';
          setDisableButton(true);
          setEditMessage({});
        }
        break;

      case e.code === 'Enter':
        e.preventDefault();
        if (!showCommandList && !showMembersList) {
          sendTypingStop();
          sendMessage();
        }
        break;
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowLeft': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          const { value, selectionStart } = messageRef.current;
          let newPosition = selectionStart;

          while (newPosition > 0 && /\s/.test(value[newPosition - 1])) {
            newPosition -= 1;
          }
          while (newPosition > 0 && !/\s/.test(value[newPosition - 1])) {
            newPosition -= 1;
          }

          messageRef.current.setSelectionRange(newPosition, newPosition);
          messageRef.current.focus();
        }
        break;
      }
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowRight': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          const { value, selectionEnd } = messageRef.current;
          let newPosition = selectionEnd;

          while (newPosition < value.length && /\s/.test(value[newPosition])) {
            newPosition += 1;
          }
          while (newPosition < value.length && !/\s/.test(value[newPosition])) {
            newPosition += 1;
          }

          messageRef.current.setSelectionRange(newPosition, newPosition);
          messageRef.current.focus();
        }
        break;
      }
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowUp': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          messageRef.current.setSelectionRange(0, 0);
          messageRef.current.focus();
        }
        break;
      }
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowDown': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          const { current } = messageRef;
          const { value } = current;
          const { length } = value;
          messageRef.current.setSelectionRange(length, length);
          messageRef.current.focus();
        }
        break;
      }
      default:
        break;
    }
  };

  return onKeyDown;
};

export default useChatInputKeyEvents;
