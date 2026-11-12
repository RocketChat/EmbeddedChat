/**
 * Utility functions for highlighting search terms in messages
 */

/**
 * Escapes special regex characters in a string
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Highlights occurrences of searchTerm within a plain text value,
 * returning an array of PLAIN_TEXT and HIGHLIGHT_TEXT tokens.
 * @param {string} text - The text to search within
 * @param {string} searchTerm - The term to highlight
 * @returns {{ tokens: Array, matchCount: number }}
 */
const highlightInText = (text, searchTerm) => {
  if (!text || !searchTerm) {
    return { tokens: [{ type: 'PLAIN_TEXT', value: text || '' }], matchCount: 0 };
  }

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  const parts = text.split(regex);
  let matchCount = 0;
  const tokens = [];

  parts.forEach((part) => {
    if (!part) return;
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      tokens.push({ type: 'HIGHLIGHT_TEXT', value: part });
      matchCount += 1;
    } else {
      tokens.push({ type: 'PLAIN_TEXT', value: part });
    }
  });

  return { tokens, matchCount };
};

/**
 * Recursively processes tokens to inject HIGHLIGHT_TEXT tokens
 * @param {Array} tokens - Array of markdown tokens
 * @param {string} searchTerm - The term to highlight
 * @returns {{ tokens: Array, matchCount: number }}
 */
const highlightInTokens = (tokens, searchTerm) => {
  if (!Array.isArray(tokens)) {
    return { tokens: [], matchCount: 0 };
  }

  let totalMatchCount = 0;
  const processedTokens = [];

  tokens.forEach((token) => {
    if (!token) return;

    switch (token.type) {
      case 'PLAIN_TEXT': {
        const { tokens: highlighted, matchCount } = highlightInText(
          token.value,
          searchTerm
        );
        processedTokens.push(...highlighted);
        totalMatchCount += matchCount;
        break;
      }

      case 'BOLD':
      case 'ITALIC':
      case 'STRIKE': {
        if (Array.isArray(token.value)) {
          const { tokens: innerTokens, matchCount } = highlightInTokens(
            token.value,
            searchTerm
          );
          processedTokens.push({ ...token, value: innerTokens });
          totalMatchCount += matchCount;
        } else if (typeof token.value === 'string') {
          const { tokens: highlighted, matchCount } = highlightInText(
            token.value,
            searchTerm
          );
          processedTokens.push({ ...token, value: highlighted });
          totalMatchCount += matchCount;
        } else {
          processedTokens.push(token);
        }
        break;
      }

      case 'LINK': {
        if (token.value && Array.isArray(token.value.label)) {
          const { tokens: labelTokens, matchCount } = highlightInTokens(
            token.value.label,
            searchTerm
          );
          processedTokens.push({
            ...token,
            value: { ...token.value, label: labelTokens },
          });
          totalMatchCount += matchCount;
        } else {
          processedTokens.push(token);
        }
        break;
      }

      case 'INLINE_CODE': {
        const codeText = typeof token.value === 'string' ? token.value : '';
        const { tokens: highlighted, matchCount } = highlightInText(
          codeText,
          searchTerm
        );
        if (matchCount > 0) {
          processedTokens.push({ ...token, value: highlighted, hasHighlight: true });
        } else {
          processedTokens.push(token);
        }
        totalMatchCount += matchCount;
        break;
      }

      default:
        processedTokens.push(token);
        break;
    }
  });

  return { tokens: processedTokens, matchCount: totalMatchCount };
};

/**
 * Processes block-level tokens (PARAGRAPH, HEADING, etc.) to inject highlighting
 * @param {Array} md - Array of block-level tokens
 * @param {string} searchTerm - The term to highlight
 * @returns {{ md: Array, matchCount: number }}
 */
const highlightInMd = (md, searchTerm) => {
  if (!Array.isArray(md)) {
    return { md: [], matchCount: 0 };
  }

  let totalMatchCount = 0;
  const processedMd = md.map((block) => {
    if (!block) return block;

    switch (block.type) {
      case 'PARAGRAPH':
      case 'HEADING': {
        const { tokens, matchCount } = highlightInTokens(block.value, searchTerm);
        totalMatchCount += matchCount;
        return { ...block, value: tokens };
      }

      case 'UNORDERED_LIST':
      case 'ORDERED_LIST': {
        const processedItems = block.value.map((item) => {
          const { tokens, matchCount } = highlightInTokens(item.value, searchTerm);
          totalMatchCount += matchCount;
          return { ...item, value: tokens };
        });
        return { ...block, value: processedItems };
      }

      case 'QUOTE': {
        const { md: innerMd, matchCount } = highlightInMd(block.value, searchTerm);
        totalMatchCount += matchCount;
        return { ...block, value: innerMd };
      }

      case 'CODE': {
        // For code blocks, check each line
        if (Array.isArray(block.value)) {
          let codeMatchCount = 0;
          const processedLines = block.value.map((line) => {
            if (typeof line.value === 'string') {
              const { tokens, matchCount } = highlightInText(line.value, searchTerm);
              codeMatchCount += matchCount;
              if (matchCount > 0) {
                return { ...line, value: tokens, hasHighlight: true };
              }
            }
            return line;
          });
          totalMatchCount += codeMatchCount;
          return { ...block, value: processedLines };
        }
        return block;
      }

      default:
        return block;
    }
  });

  return { md: processedMd, matchCount: totalMatchCount };
};

/**
 * Applies search term highlighting to a message.
 * If message has `md`, injects HIGHLIGHT_TEXT tokens.
 * If message only has `msg`, creates basic PARAGRAPH tokens with highlighting.
 * Returns a NEW message object (does not mutate original).
 *
 * @param {Object} message - The message object
 * @param {string} searchTerm - The term to highlight
 * @returns {{ message: Object, matchCount: number }}
 */
export const applyHighlightToMessage = (message, searchTerm) => {
  if (!message || !searchTerm || !searchTerm.trim()) {
    return { message, matchCount: 0 };
  }

  const term = searchTerm.trim();

  // If message has md tokens, process them
  if (message.md && Array.isArray(message.md)) {
    const { md, matchCount } = highlightInMd(message.md, term);
    return {
      message: { ...message, md },
      matchCount,
    };
  }

  // If message only has msg (plain text), create basic md structure
  if (message.msg && typeof message.msg === 'string') {
    const { tokens, matchCount } = highlightInText(message.msg, term);
    return {
      message: {
        ...message,
        md: [{ type: 'PARAGRAPH', value: tokens }],
      },
      matchCount,
    };
  }

  return { message, matchCount: 0 };
};

/**
 * Applies highlighting to an array of messages.
 * Returns NEW array with NEW message objects (does not mutate originals).
 *
 * @param {Array} messages - Array of message objects
 * @param {string} searchTerm - The term to highlight
 * @returns {{ messages: Array, totalMatchCount: number }}
 */
export const applyHighlightToMessages = (messages, searchTerm) => {
  if (!Array.isArray(messages) || !searchTerm || !searchTerm.trim()) {
    return { messages: messages || [], totalMatchCount: 0 };
  }

  let totalMatchCount = 0;
  const highlightedMessages = messages.map((msg) => {
    const { message, matchCount } = applyHighlightToMessage(msg, searchTerm);
    totalMatchCount += matchCount;
    return message;
  });

  return { messages: highlightedMessages, totalMatchCount };
};
