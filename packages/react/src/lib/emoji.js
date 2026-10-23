import emojione from 'emoji-toolkit';

export const parseEmoji = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  const regx = /:([^:\s]+):/g;
  return text.replace(regx, (match) => {
    const unicode = emojione.shortnameToUnicode(match);
    return unicode !== undefined ? unicode : match;
  });
};
