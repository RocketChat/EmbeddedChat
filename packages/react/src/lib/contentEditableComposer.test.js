import { renderComposerMarkdown } from './contentEditableComposer';

describe('renderComposerMarkdown', () => {
  const render = (markdown) => {
    const element = document.createElement('div');
    renderComposerMarkdown(element, markdown);
    return element.innerHTML;
  };

  test('does not treat underscores inside a word as emphasis', () => {
    expect(render('my_file_name.js')).toBe('my_file_name.js');
    expect(render('call foo_bar_baz() now')).toBe('call foo_bar_baz() now');
  });

  test('does not open emphasis on a marker followed by whitespace', () => {
    expect(render('2 * 3 * 4 = 24')).toBe('2 * 3 * 4 = 24');
  });

  test('still renders emphasis at word boundaries', () => {
    expect(render('__init__')).toBe('<strong>init</strong>');
    expect(render('**bold**')).toBe('<strong>bold</strong>');
    expect(render('*italic*')).toBe('<em>italic</em>');
  });
});
