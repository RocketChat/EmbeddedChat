import { useState } from 'react';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';

/**
 * useAiSupport - A custom hook to handle the pluggable AI adapter logic for ChatInput.
 * This directly supports the GSoC 2026 'Modernizing the AI Layer' deliverable.
 */
const useAiSupport = (messageRef, setDisableButton, ECOptions) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const dispatchToastMessage = useToastBarDispatch();

  const handleAiAssist = async () => {
    if (!ECOptions?.aiAdapter) {
      dispatchToastMessage({
        type: 'warning',
        message: 'No AI adapter configured. Pass aiAdapter prop to <EmbeddedChat />.',
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const adapter = ECOptions.aiAdapter;
      // Gather context for the AI (currently just the current message, 
      // but scoped for multi-message context in the 2026 roadmap).
      const context = [
        { msg: messageRef.current.value || 'Hello! What can I help you with today?' },
      ];

      const replies = await adapter.getSmartReplies(context);

      if (replies && replies.length > 0) {
        messageRef.current.value = (
          messageRef.current.value + ' ' + replies[0]
        ).trim();
        setDisableButton(false);
        // Trigger a fake 'scroll to bottom' to ensure the input field expansion doesn't hide text.
        messageRef.current.focus();
      }
    } catch (e) {
      console.error('AI Support Hook Error:', e);
      dispatchToastMessage({ 
        type: 'error', 
        message: 'AI generation failed. Please check your adapter configuration.' 
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return { handleAiAssist, isAiLoading };
};

export default useAiSupport;
