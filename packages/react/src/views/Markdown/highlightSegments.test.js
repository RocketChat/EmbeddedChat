import highlightSegments from '@embeddedchat/markups/src/elements/highlightSegments';

const texts = (segments) => segments.map((s) => s.text);
const matches = (segments) => segments.filter((s) => s.match).map((s) => s.text);

describe('highlightSegments', () => {
  test('returns the text untouched when there is no term', () => {
    expect(highlightSegments('hello world', '')).toEqual([
      { text: 'hello world', match: false },
    ]);
    expect(highlightSegments('hello world', '   ')).toEqual([
      { text: 'hello world', match: false },
    ]);
    expect(highlightSegments('hello world', undefined)).toEqual([
      { text: 'hello world', match: false },
    ]);
  });

  test('returns the text untouched when the term does not occur', () => {
    expect(highlightSegments('hello world', 'zzz')).toEqual([
      { text: 'hello world', match: false },
    ]);
  });

  test('splits around a match in the middle', () => {
    const segments = highlightSegments('say hello there', 'hello');
    expect(texts(segments)).toEqual(['say ', 'hello', ' there']);
    expect(matches(segments)).toEqual(['hello']);
  });

  test('handles a match at the start and at the end', () => {
    expect(texts(highlightSegments('hello there', 'hello'))).toEqual([
      'hello',
      ' there',
    ]);
    expect(texts(highlightSegments('say hello', 'hello'))).toEqual([
      'say ',
      'hello',
    ]);
  });

  test('marks every occurrence, not just the first', () => {
    const segments = highlightSegments('bug, bug and bug', 'bug');
    expect(matches(segments)).toEqual(['bug', 'bug', 'bug']);
  });

  test('matches case-insensitively but keeps the original casing', () => {
    const segments = highlightSegments('Hello HELLO hello', 'hello');
    expect(matches(segments)).toEqual(['Hello', 'HELLO', 'hello']);
  });

  test('rejoins to exactly the original text', () => {
    const input = 'Search for Bug inside this bug report';
    const segments = highlightSegments(input, 'bug');
    expect(texts(segments).join('')).toBe(input);
  });
});
