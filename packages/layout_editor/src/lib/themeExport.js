const serializeTheme = (theme) => JSON.stringify(theme, null, 2);

export const copyThemeToClipboard = async (theme) => {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard access is unavailable in this browser.');
  }
  await navigator.clipboard.writeText(serializeTheme(theme));
};

export const downloadTheme = (theme, fileName = 'embeddedchat-theme.json') => {
  const blob = new Blob([serializeTheme(theme)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};
