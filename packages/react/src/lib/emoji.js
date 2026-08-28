import emojione from 'emoji-toolkit';

export const parseEmoji = (text) => emojione.shortnameToUnicode(text);
