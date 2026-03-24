import { useState, useCallback } from 'react';
import { useRCContext } from '../context/RCInstance';

export const useAIAdapter = () => {
  const { aiAdapter } = useRCContext();
  const [suggestions, setSuggestions] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = useCallback(
    async (messages) => {
      if (!aiAdapter) return;
      setIsLoading(true);
      try {
        const result = await aiAdapter.suggestReply(messages);
        setSuggestions(result);
      } catch (e) {
        console.error('AI suggestReply failed:', e);
      } finally {
        setIsLoading(false);
      }
    },
    [aiAdapter]
  );

  const getThreadSummary = useCallback(
    async (messages) => {
      if (!aiAdapter) return;
      setIsLoading(true);
      try {
        const result = await aiAdapter.summarizeThread(messages);
        setSummary(result);
      } catch (e) {
        console.error('AI summarizeThread failed:', e);
      } finally {
        setIsLoading(false);
      }
    },
    [aiAdapter]
  );

  return {
    isAIEnabled: !!aiAdapter,
    suggestions,
    summary,
    isLoading,
    getSuggestions,
    getThreadSummary,
  };
};
