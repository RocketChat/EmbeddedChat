const toEm = (length) => {
  if (typeof length === 'number' && !isNaN(length)) {
    return `${length / 16}em`;
  }
  return length;
};

const toRem = (length) => {
  if (typeof length === 'number' && !isNaN(length)) {
    return `${length / 16}rem`;
  }
  return length;
};

const theme = (varName, value) => {
  return `var(--rcx-${varName}, ${value})`;
};

export { toEm, toRem, theme };
