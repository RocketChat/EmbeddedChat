import { useState, useCallback, useRef } from 'react';

// ─── Actions ──────────────────────────────────────────────────────────────────
// Split into two rows for the toolbar UI
const ACTIONS = [
  { key: 'grammar', label: '🛠️ Grammar', group: 1 },
  { key: 'spelling', label: '✏️ Spelling', group: 1 },
  { key: 'rephrase', label: '✨ Rephrase', group: 1 },
  { key: 'match_tone', label: '🎯 Match Tone', group: 1 },
  { key: 'formal', label: '💼 Formal', group: 2 },
  { key: 'casual', label: '😊 Casual', group: 2 },
  { key: 'shorten', label: '✂️ Shorten', group: 2 },
  { key: 'expand', label: '📖 Expand', group: 2 },
  { key: 'emojify', label: '😄 Add Emojis', group: 2 },
  { key: 'translate', label: '🌐 Translate', group: 2 },
];

// ─── Prompt builders ───────────────────────────────────────────────────────────
const historySnippet = (messages = []) => {
  if (!messages.length) return '';
  const recent = messages
    .slice(-8)
    .filter((m) => m.msg)
    .map((m) => `- ${m.msg}`)
    .join('\n');
  return recent
    ? `\n\nRecent messages in this channel for context:\n${recent}\n`
    : '';
};

const PROMPTS = {
  grammar: (t) =>
    `Fix all grammar mistakes in the following text. Keep the original meaning and style. Return ONLY the corrected text, no explanation.\n\nText: ${t}`,

  spelling: (t, msgs) =>
    `Correct any spelling errors in the following text.${historySnippet(
      msgs
    )}Use the conversation context above to correctly identify technical terms, proper nouns, and domain-specific vocabulary. Return ONLY the corrected text, no explanation.\n\nText: ${t}`,

  rephrase: (t) =>
    `Rephrase the following for clarity and natural flow. Eliminate jargon unless it is domain-appropriate. Return ONLY the rephrased text, no explanation.\n\nText: ${t}`,

  match_tone: (t, msgs) => {
    const ctx = historySnippet(msgs);
    if (!ctx) {
      return `Rephrase the following in a conversational, natural tone. Return ONLY the rephrased text, no explanation.\n\nText: ${t}`;
    }
    return `Analyze the tone, vocabulary, and writing style of the recent messages below, then rewrite the given text to match that style exactly.${ctx}Rewrite in the same tone and style. Return ONLY the rewritten text, no explanation.\n\nText: ${t}`;
  },

  formal: (t) =>
    `Rewrite the following in a professional and formal tone. Return ONLY the rewritten text, no explanation.\n\nText: ${t}`,

  casual: (t) =>
    `Rewrite the following in a friendly, conversational tone. Return ONLY the rewritten text, no explanation.\n\nText: ${t}`,

  shorten: (t) =>
    `Summarize the following into one concise sentence without losing the key point. Return ONLY the shortened text, no explanation.\n\nText: ${t}`,

  expand: (t) =>
    `Elaborate the following with more relevant detail and context. Return ONLY the expanded text, no explanation.\n\nText: ${t}`,

  emojify: (t) =>
    `Add relevant, expressive emojis to the following message. Place them naturally within or at the end of sentences — do not overdo it. Return ONLY the emojified text, no explanation.\n\nText: ${t}`,

  translate: (t) =>
    `Translate the following to English. Return ONLY the translated text, no explanation.\n\nText: ${t}`,
};

// ─── Response cleaner ──────────────────────────────────────────────────────────
const cleanResponse = (text) =>
  text
    .replace(
      /^(sure[!,.]?|here('s| is)[^:]*:|of course[!,.]?|absolutely[!,.]?)\s*/i,
      ''
    )
    .replace(/^["""'`]|["""'`]$/g, '')
    .trim();

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useAIComposer = ({
  aiAdapter,
  ECOptions,
  userId,
  messageRef,
  messages = [],
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const selectionRef = useRef({ start: 0, end: 0, text: '' });

  const handleMouseUp = useCallback(() => {
    if (!aiAdapter || !messageRef.current) return;
    const { selectionStart, selectionEnd, value } = messageRef.current;
    const selected = value.slice(selectionStart, selectionEnd).trim();
    if (selected.length < 2) {
      setShowToolbar(false);
      return;
    }
    selectionRef.current = {
      start: selectionStart,
      end: selectionEnd,
      text: selected,
    };
    setShowToolbar(true);
    setSuggestion(null);
  }, [aiAdapter, messageRef]);

  const handleKeyUp = useCallback(() => {
    if (!aiAdapter || !messageRef.current) return;
    const { selectionStart, selectionEnd, value } = messageRef.current;
    const selected = value.slice(selectionStart, selectionEnd).trim();
    if (selected.length < 2) setShowToolbar(false);
  }, [aiAdapter, messageRef]);

  const runAction = useCallback(
    async (actionKey) => {
      const { text, start, end } = selectionRef.current;
      if (!text || !aiAdapter || isProcessing) return;
      setIsProcessing(true);
      setActiveAction(actionKey);
      setShowToolbar(false);
      try {
        const aiContext = {
          roomId: ECOptions?.roomId ?? '',
          userId,
          history: [],
        };
        const prompt = PROMPTS[actionKey](text, messages);
        const response = await aiAdapter.sendPrompt(aiContext, prompt);
        if (response?.text) {
          setSuggestion({
            text: cleanResponse(response.text),
            selStart: start,
            selEnd: end,
            original: text,
            actionKey,
          });
        }
      } catch (e) {
        console.error('[AI Composer] action failed:', e);
      } finally {
        setIsProcessing(false);
        setActiveAction(null);
      }
    },
    [aiAdapter, ECOptions, userId, messages, isProcessing]
  );

  const acceptSuggestion = useCallback(() => {
    if (!suggestion || !messageRef.current) return;
    const { value } = messageRef.current;
    const newValue =
      value.slice(0, suggestion.selStart) +
      suggestion.text +
      value.slice(suggestion.selEnd);
    messageRef.current.value = newValue;
    const newCursor = suggestion.selStart + suggestion.text.length;
    messageRef.current.setSelectionRange(newCursor, newCursor);
    messageRef.current.focus();
    setSuggestion(null);
  }, [suggestion, messageRef]);

  const rejectSuggestion = useCallback(() => {
    setSuggestion(null);
    messageRef.current?.focus();
  }, [messageRef]);

  const dismissToolbar = useCallback(() => {
    setShowToolbar(false);
  }, []);

  return {
    showToolbar,
    suggestion,
    isProcessing,
    activeAction,
    actions: ACTIONS,
    handleMouseUp,
    handleKeyUp,
    runAction,
    acceptSuggestion,
    rejectSuggestion,
    dismissToolbar,
  };
};

export default useAIComposer;
