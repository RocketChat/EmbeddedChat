import emojione from 'emoji-toolkit';

export const parseEmoji = (text) =>
  text.replace(/:([^:\s]+):/g, (match) => {
    const unicode = emojione.shortnameToUnicode(match);
    return unicode !== undefined && unicode !== match ? unicode : match;
  });
