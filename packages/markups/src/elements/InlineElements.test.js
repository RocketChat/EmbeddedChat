import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import InlineElements from './InlineElements';

jest.mock('./ItalicSpan', () => ({
  __esModule: true,
  default: () => <span data-kind="italic" />,
}));
jest.mock('./StrikeSpan', () => ({
  __esModule: true,
  default: () => <span data-kind="strike" />,
}));
jest.mock('./BoldSpan', () => ({
  __esModule: true,
  default: () => <span data-kind="bold" />,
}));
jest.mock('./CodeElement', () => ({
  __esModule: true,
  default: () => <span data-kind="inline-code" />,
}));
jest.mock('./Emoji', () => ({
  __esModule: true,
  default: () => <span data-kind="emoji" />,
}));
jest.mock('../mentions/ChannelMention', () => ({
  __esModule: true,
  default: () => <span data-kind="mention-channel" />,
}));
jest.mock('./ColorElement', () => ({
  __esModule: true,
  default: () => <span data-kind="color" />,
}));
jest.mock('./LinkSpan', () => ({
  __esModule: true,
  default: () => <span data-kind="link" />,
}));
jest.mock('./TimestampElement', () => ({
  __esModule: true,
  default: () => <span data-kind="timestamp" />,
}));

jest.mock('./PlainSpan', () => ({
  __esModule: true,
  default: ({ contents }) => <span data-kind="plain">{contents}</span>,
}));

jest.mock('../mentions/UserMention', () => ({
  __esModule: true,
  default: ({ contents }) => (
    <span data-kind="mention-user">{contents.value}</span>
  ),
}));

describe('InlineElements mention rendering', () => {
  test('renders wrapped user mentions as plain text', () => {
    const contents = [
      { type: 'PLAIN_TEXT', value: '(' },
      { type: 'MENTION_USER', value: { type: 'PLAIN_TEXT', value: 'test' } },
      { type: 'PLAIN_TEXT', value: ')' },
    ];

    const html = renderToStaticMarkup(<InlineElements contents={contents} />);

    expect(html).toContain('data-kind="plain">@test</span>');
    expect(html).not.toContain('data-kind="mention-user">test</span>');
  });

  test('renders wrapped mentions with spaces as plain text', () => {
    const contents = [
      { type: 'PLAIN_TEXT', value: '( ' },
      { type: 'MENTION_USER', value: { type: 'PLAIN_TEXT', value: 'test' } },
      { type: 'PLAIN_TEXT', value: ' )' },
    ];

    const html = renderToStaticMarkup(<InlineElements contents={contents} />);

    expect(html).toContain('data-kind="plain">@test</span>');
    expect(html).not.toContain('data-kind="mention-user">test</span>');
  });

  test('keeps normal mentions styled when not wrapped', () => {
    const contents = [
      { type: 'PLAIN_TEXT', value: 'hello ' },
      { type: 'MENTION_USER', value: { type: 'PLAIN_TEXT', value: 'test' } },
      { type: 'PLAIN_TEXT', value: ' world' },
    ];

    const html = renderToStaticMarkup(<InlineElements contents={contents} />);

    expect(html).toContain('data-kind="mention-user">test</span>');
    expect(html).not.toContain('data-kind="plain">@test</span>');
  });
});
