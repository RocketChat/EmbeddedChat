const formatSelection = (messageRef, pattern) => {
  const input = messageRef.current;
  if (!input) return;

  const { selectionEnd = input.value.length, selectionStart = 0 } = input;
  const initText = input.value.slice(0, selectionStart);
  const selectedText = input.value.slice(selectionStart, selectionEnd);
  const finalText = input.value.slice(selectionEnd, input.value.length);

  const startPattern = pattern.slice(0, pattern.indexOf('{{text}}'));
  const endPattern = pattern.slice(
    pattern.indexOf('{{text}}') + '{{text}}'.length
  );

  const startPatternFound = initText.endsWith(startPattern);
  const endPatternFound = finalText.startsWith(endPattern);

  if (startPatternFound && endPatternFound) {
    input.value =
      initText.slice(0, initText.length - startPattern.length) +
      selectedText +
      finalText.slice(endPattern.length);
    input.selectionStart = selectionStart - startPattern.length;
    input.selectionEnd = input.selectionStart + selectedText.length;
  } else {
    const wrappedText = startPattern + selectedText + endPattern;
    input.value = initText + wrappedText + finalText;
    input.selectionStart = selectionStart + startPattern.length;
    input.selectionEnd = input.selectionStart + selectedText.length;
  }

  input.focus();
};

export default formatSelection;
