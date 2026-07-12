const insertListPrefix = (messageRef, listPrefix) => {
  const input = messageRef.current;
  if (!input) return;

  const { selectionStart, value } = input;
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionStart);

  const needsNewline = before.length > 0 && !before.endsWith('\n');
  const prefix = listPrefix(1);
  const insert = (needsNewline ? '\n' : '') + prefix;

  input.value = before + insert + after;
  const cursorPos = selectionStart + insert.length;
  input.selectionStart = cursorPos;
  input.selectionEnd = cursorPos;
  input.focus();
};

export default insertListPrefix;
