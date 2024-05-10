import { css } from '@emotion/react';

export const CodeBlockStyles = {
  copyonly: css`
    display: none;
    width: 100%;
    height: 0;
    user-select: none;
    vertical-align: baseline;
    font-size: 0;
    -moz-box-orient: vertical;
  `,

  prestyle: css`
    display: inline-block;
    max-width: 100%;
    overflow-x: auto;
    white-space: pre-wrap;
  `,
};

export const ColorElementStyles = {
  colorBox: (r, g, b, a) => css`
    background-color: rgba(${r}, ${g}, ${b}, ${(a / 255) * 100}%);
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    margin-inline-end: 0.5em;
  `,
};

export const EmojiStyles = {
  emojiInMessage: css`
    img.joypixels {
      height: 1.5rem;
      width: 1.5rem;
      image-rendering: pixelated;
      font-size: inherit;
      vertical-align: middle;
    }

    img.joypixels_BigEmoji {
      height: 2.25rem;
      width: 2.25rem;
      image-rendering: pixelated;
      font-size: inherit;
    }
  `,

  emojione: css`
    margin: 0 0.15em;
    vertical-align: middle;
    white-space: nowrap;
    font-size: inherit;
    line-height: normal;
  `,
};

export const MentionStyles = {
  mention: (contents, username) => css`
    background-color: ${contents.value === 'all' || contents.value === 'here'
      ? '#f38c39'
      : contents.value === username
      ? '#ec0d2a'
      : '#e4e7ea'};
    color: ${contents.value === 'all' || contents.value === 'here'
      ? '#ffffff'
      : contents.value === username
      ? '#ffffff'
      : '#2f343d'};
    font-weight: bold;
    cursor: pointer;
    padding: 1.5px;
    border-radius: 3px;

    &:hover {
      text-decoration: ${contents.value === 'all' || contents.value === 'here'
        ? 'none'
        : 'underline'};
    }
  `,
};
