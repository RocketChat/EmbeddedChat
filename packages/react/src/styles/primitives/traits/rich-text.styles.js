/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { colors } from '../../colors.styles';
import { lengths } from '../../lengths.styles';
import { typography } from '../../typography.styles';

const withInlineElements = css`
  a,
  abbr,
  b,
  cite,
  code,
  del,
  dfn,
  em,
  i,
  ins,
  kbd,
  q,
  samp,
  small,
  strong,
  sub,
  sup,
  time,
  var {
    letter-spacing: inherit;
    color: inherit;
    font: inherit;
  }

  a {
    &:link,
    &:visited,
    &.is-visited,
    &:active,
    &.is-active {
      color: ${colors.font.info};
    }

    &:hover,
    &.is-hovered {
      text-decoration: underline;
    }
  }

  // ... (other styles)

  time {
    letter-spacing: inherit;
    color: ${colors.font.secondaryInfo};
    font: inherit;
  }

  // ... (other styles)

  small {
    letter-spacing: inherit;
    font: inherit;
    font-size: 80%;
  }
`;

const withBlockElements = css`
  font: inherit;

  h1 {
    ${typography.useFontScale('h2')};
  }

  h2 {
    ${typography.useFontScale('h4')};
  }

  h3 {
    ${typography.useFontScale('p2m')};
  }

  // ... (other styles)
`;

// Example usage:
const myStyledComponent = css`
  ${withInlineElements};
  ${withBlockElements};
`;

// Apply myStyledComponent to your component
