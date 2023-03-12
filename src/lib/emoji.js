import emojione from 'emoji-toolkit';

export const parseEmoji = (text) => {
  const regx = /:([^:]*):/g;
  const regx_data = text.match(regx);
  if (regx_data) {
    const result = regx_data[regx_data.length - 1];
    const d = emojione.shortnameToUnicode(result);
    if (d !== undefined) text = text.replace(result, d);
  }
  return text;
};
