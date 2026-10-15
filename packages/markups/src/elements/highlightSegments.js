/**
 * Splits `text` around every case-insensitive occurrence of `term`.
 * Returns a flat list of segments so callers can wrap only the matches.
 * With no usable term the text comes back as a single unmatched segment,
 * which lets callers keep their existing render path untouched.
 */
const highlightSegments = (text, term) => {
  const needle = typeof term === 'string' ? term.trim().toLowerCase() : '';
  if (!needle || typeof text !== 'string' || !text) {
    return [{ text, match: false }];
  }

  const haystack = text.toLowerCase();
  const segments = [];
  let cursor = 0;

  for (;;) {
    const found = haystack.indexOf(needle, cursor);
    if (found === -1) {
      break;
    }
    if (found > cursor) {
      segments.push({ text: text.slice(cursor, found), match: false });
    }
    segments.push({
      text: text.slice(found, found + needle.length),
      match: true,
    });
    cursor = found + needle.length;
  }

  if (!segments.length) {
    return [{ text, match: false }];
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }
  return segments;
};

export default highlightSegments;
