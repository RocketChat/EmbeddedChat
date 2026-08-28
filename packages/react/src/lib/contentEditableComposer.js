const textNodes = (element) => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    nodes.push(node);
    node = walker.nextNode();
  }
  return nodes;
};

const composerText = (element) => {
  const snapshot = element.cloneNode(true);
  snapshot
    .querySelectorAll('.ec-ai-suggestion-controls')
    .forEach((controls) => controls.remove());

  // AI spans render Markdown as DOM so people can review the change in place.
  // Sending must still use the original Markdown, not the rendered text.
  snapshot.querySelectorAll('[data-composer-value]').forEach((suggestion) => {
    suggestion.replaceWith(
      document.createTextNode(suggestion.dataset.composerValue ?? '')
    );
  });
  return snapshot.innerText;
};

const safeLink = (value) => /^(https?:\/\/|mailto:)/i.test(value);

const appendText = (parent, text) => {
  if (text) parent.appendChild(document.createTextNode(text));
};

const findLink = (text, start) => {
  const labelEnd = text.indexOf('](', start + 1);
  if (labelEnd === -1) return null;
  const urlEnd = text.indexOf(')', labelEnd + 2);
  if (urlEnd === -1) return null;

  return {
    label: text.slice(start + 1, labelEnd),
    url: text.slice(labelEnd + 2, urlEnd),
    end: urlEnd + 1,
  };
};

const appendMarkdown = (parent, text) => {
  const tokens = [
    ['**', 'strong'],
    ['__', 'strong'],
    ['~~', 's'],
    ['`', 'code'],
    ['*', 'em'],
    ['_', 'em'],
  ];
  let index = 0;
  let plainText = '';

  const flush = () => {
    appendText(parent, plainText);
    plainText = '';
  };

  while (index < text.length) {
    let nextIndex = index + 1;
    if (text[index] === '\n') {
      flush();
      parent.appendChild(document.createElement('br'));
    } else if (text[index] === '[') {
      const link = findLink(text, index);
      if (link && safeLink(link.url)) {
        flush();
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noreferrer noopener';
        appendMarkdown(anchor, link.label);
        parent.appendChild(anchor);
        nextIndex = link.end;
      } else {
        plainText += text[index];
      }
    } else {
      let token;
      for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
        if (text.startsWith(tokens[tokenIndex][0], index)) {
          token = tokens[tokenIndex];
          break;
        }
      }

      if (token) {
        const [marker, tagName] = token;
        const end = text.indexOf(marker, index + marker.length);
        if (end > index + marker.length) {
          flush();
          const formatted = document.createElement(tagName);
          const content = text.slice(index + marker.length, end);
          if (tagName === 'code') {
            formatted.textContent = content;
          } else {
            appendMarkdown(formatted, content);
          }
          parent.appendChild(formatted);
          nextIndex = end + marker.length;
        } else {
          plainText += text[index];
        }
      } else {
        plainText += text[index];
      }
    }

    index = nextIndex;
  }

  flush();
};

// This intentionally supports the subset of Markdown the composer creates and
// receives from AI: bold, italic, strikethrough, inline code, line breaks and
// links. It constructs DOM nodes rather than assigning HTML from model output.
export const renderComposerMarkdown = (element, markdown) => {
  element.dataset.composerValue = markdown;
  element.replaceChildren();
  appendMarkdown(element, markdown);
};

export const getContentSelection = (element) => {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return { start: 0, end: 0 };

  const range = selection.getRangeAt(0);
  if (!element.contains(range.commonAncestorContainer)) {
    return { start: 0, end: 0 };
  }

  const beforeStart = range.cloneRange();
  beforeStart.selectNodeContents(element);
  beforeStart.setEnd(range.startContainer, range.startOffset);
  const beforeEnd = range.cloneRange();
  beforeEnd.selectNodeContents(element);
  beforeEnd.setEnd(range.endContainer, range.endOffset);

  return {
    start: beforeStart.toString().length,
    end: beforeEnd.toString().length,
  };
};

export const setContentSelection = (element, start, end = start) => {
  const nodes = textNodes(element);
  const range = document.createRange();
  let offset = 0;
  let startNode = element;
  let endNode = element;
  let startOffset = 0;
  let endOffset = 0;

  nodes.forEach((node) => {
    const length = node.nodeValue?.length ?? 0;
    if (start >= offset && start <= offset + length) {
      startNode = node;
      startOffset = start - offset;
    }
    if (end >= offset && end <= offset + length) {
      endNode = node;
      endOffset = end - offset;
    }
    offset += length;
  });

  if (!nodes.length) {
    startNode = element;
    endNode = element;
  }

  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

// The existing composer integrations use textarea-like value and selection APIs.
// Installing this narrow compatibility layer lets mentions, emoji and formatting
// continue to work while the editor itself becomes rich, inline DOM.
export const installContentEditableApi = (element) => {
  if (element.dataset.composerApiInstalled) return;
  element.dataset.composerApiInstalled = 'true';

  Object.defineProperties(element, {
    value: {
      configurable: true,
      get: () => composerText(element),
      set: (value) => {
        element.textContent = value;
      },
    },
    selectionStart: {
      configurable: true,
      get: () => getContentSelection(element).start,
      set: (start) => {
        setContentSelection(element, start, getContentSelection(element).end);
      },
    },
    selectionEnd: {
      configurable: true,
      get: () => getContentSelection(element).end,
      set: (end) => {
        setContentSelection(element, getContentSelection(element).start, end);
      },
    },
  });

  element.setSelectionRange = (start, end) =>
    setContentSelection(element, start, end);
};
