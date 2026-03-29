import { useRef, useCallback } from 'react';

/**
 * useTypingStatus - A hook to manage the 'User is typing...' status.
 * Decouples typing-indicator side-effects from the main ChatInput view.
 */
const useTypingStatus = (RCInstance, username) => {
  const typingRef = useRef(false);
  const timerRef = useRef(null);

  const sendTypingStop = useCallback(async () => {
    try {
      if (typingRef.current) {
        typingRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        await RCInstance.sendTypingStatus(username, false);
      }
    } catch (e) {
      console.error('Typing indicator error (stop):', e);
    }
  }, [RCInstance, username]);

  const sendTypingStart = useCallback(async (currentMessageValue) => {
    try {
      // If we are already typing and still have message content, do nothing (to avoid spamming the server).
      if (typingRef.current && currentMessageValue?.length) {
        return;
      }

      if (currentMessageValue?.length) {
        typingRef.current = true;
        
        // Reset the typing timeout (typing status is valid for 15 seconds by default in RC).
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          typingRef.current = false;
        }, 15000);

        await RCInstance.sendTypingStatus(username, true);
      } else {
        // If the user clears the input, stop the typing status immediately.
        await sendTypingStop();
      }
    } catch (e) {
      console.error('Typing indicator error (start):', e);
    }
  }, [RCInstance, username, sendTypingStop]);

  return { sendTypingStart, sendTypingStop };
};

export default useTypingStatus;
