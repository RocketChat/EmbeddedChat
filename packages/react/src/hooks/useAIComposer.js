import { useCallback, useRef, useState } from 'react';
import { renderComposerMarkdown } from '../lib/contentEditableComposer';

const ACTIONS = [
  { key: 'grammar', label: 'Fix grammar' },
  { key: 'shorten', label: 'Shorten' },
  { key: 'translate', label: 'Translate' },
  { key: 'emojify', label: 'Emojify' },
];

const transformationPrompt = (
  instruction,
  text
) => `You are an exact text transformation function.

${instruction}

Transform ONLY the text between <source> and </source>. Do not use, continue, quote, answer, or infer anything from a chat conversation. Do not add commentary, explanations, labels, notes, quotation marks, markdown fences, or alternatives. Return only the transformed source text.

<source>
${text}
</source>`;

const prompts = {
  grammar: (text) =>
    transformationPrompt(
      'Correct grammar and spelling. Preserve the original meaning, language, and tone.',
      text
    ),
  shorten: (text) =>
    transformationPrompt(
      'Make the source shorter while retaining every key point. Do not introduce new facts.',
      text
    ),
  translate: (text) =>
    transformationPrompt(
      'Translate the source to English. Preserve its meaning, names, and formatting.',
      text
    ),
  emojify: (text) =>
    transformationPrompt(
      'Copy the complete source text verbatim, then insert at most three relevant, natural emojis. Preserve every original word in the same order. Never replace words with emojis and never return emojis alone.',
      text
    ),
};

const preservesSourceWords = (source, result) => {
  const words = (text) =>
    text
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  const sourceWords = words(source);
  return !sourceWords || words(result).includes(sourceWords);
};

const cleanResponse = (text) =>
  text
    .replace(/^(sure[!,.]?|here('s| is)[^:]*:|of course[!,.]?)\s*/i, '')
    .replace(/^["'`]|["'`]$/g, '')
    .trim();

const dispatchInput = (node) =>
  node.dispatchEvent(new Event('input', { bubbles: true }));

const typeSuggestion = (span, text) =>
  new Promise((resolve) => {
    let index = 0;
    const timer = window.setInterval(() => {
      if (!span.isConnected) {
        window.clearInterval(timer);
        resolve();
        return;
      }
      renderComposerMarkdown(span, text.slice(0, index + 1));
      index += 1;
      if (index >= text.length) {
        window.clearInterval(timer);
        resolve();
      }
    }, 18);
  });

const addSuggestionControls = (span, original, replacement, onChange) => {
  span.className = 'ec-ai-suggestion';
  span.contentEditable = 'false';
  renderComposerMarkdown(span, replacement);

  const controls = document.createElement('span');
  controls.className = 'ec-ai-suggestion-controls';
  controls.contentEditable = 'false';

  const settle = (text) => {
    if (!span.parentNode) return;
    const node = document.createTextNode(text);
    span.parentNode.replaceChild(node, span);
    onChange();
  };

  const accept = document.createElement('button');
  accept.type = 'button';
  accept.className = 'ec-ai-suggestion-accept';
  accept.setAttribute('aria-label', 'Accept AI change');
  accept.title = 'Accept change';
  accept.addEventListener('mousedown', (event) => event.preventDefault());
  accept.addEventListener('click', () => settle(replacement));

  const reject = document.createElement('button');
  reject.type = 'button';
  reject.className = 'ec-ai-suggestion-reject';
  reject.setAttribute('aria-label', 'Discard AI change');
  reject.title = 'Discard change';
  reject.addEventListener('mousedown', (event) => event.preventDefault());
  reject.addEventListener('click', () => settle(original));

  controls.append(accept, reject);
  span.append(controls);
};

const useAIComposer = ({ aiAdapter, ECOptions, userId, messageRef }) => {
  const [popup, setPopup] = useState(null);
  const rangeRef = useRef(null);

  const updateSelection = useCallback(
    (event) => {
      const editor = messageRef.current;
      const selection = window.getSelection();
      if (
        !editor ||
        !aiAdapter ||
        !selection?.rangeCount ||
        selection.isCollapsed
      ) {
        setPopup(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (
        !editor.contains(range.commonAncestorContainer) ||
        !range.toString().trim()
      ) {
        setPopup(null);
        return;
      }

      rangeRef.current = range.cloneRange();
      const rect = range.getBoundingClientRect();
      setPopup({
        x: event?.clientX ?? rect.left,
        y: event?.clientY ?? rect.bottom + 6,
      });
    },
    [aiAdapter, messageRef]
  );

  const runAction = useCallback(
    async (actionKey) => {
      const editor = messageRef.current;
      const range = rangeRef.current;
      if (!editor || !range || !aiAdapter) return;

      const original = range.toString();
      if (!original.trim()) return;
      const span = document.createElement('span');
      span.className = 'ec-ai-pending';
      span.contentEditable = 'false';
      span.textContent = original;
      range.deleteContents();
      range.insertNode(span);
      window.getSelection()?.removeAllRanges();
      rangeRef.current = null;
      setPopup(null);
      dispatchInput(editor);

      try {
        const response = await aiAdapter.sendPrompt(
          {
            roomId: ECOptions?.roomId ?? '',
            userId,
            history: [],
            metadata: { task: 'composer' },
          },
          prompts[actionKey](original)
        );
        const replacement = response?.text && cleanResponse(response.text);
        const isInvalidEmojify =
          actionKey === 'emojify' &&
          replacement &&
          !preservesSourceWords(original, replacement);
        if (!replacement || isInvalidEmojify || !span.isConnected) {
          if (span.isConnected)
            span.replaceWith(document.createTextNode(original));
          dispatchInput(editor);
          return;
        }

        await typeSuggestion(span, replacement);
        if (span.isConnected) {
          addSuggestionControls(span, original, replacement, () =>
            dispatchInput(editor)
          );
          dispatchInput(editor);
        }
      } catch (error) {
        console.error('[AI Composer] action failed:', error);
        if (span.isConnected)
          span.replaceWith(document.createTextNode(original));
        dispatchInput(editor);
      }
    },
    [aiAdapter, ECOptions?.roomId, messageRef, userId]
  );

  return {
    actions: ACTIONS,
    popup,
    updateSelection,
    runAction,
    dismissActions: () => setPopup(null),
  };
};

export default useAIComposer;
