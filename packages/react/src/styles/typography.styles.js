// Import necessary dependencies from Emotion
import { css } from '@emotion/react';

// Import the font families and font scales from the tokens
import typography from '@rocket.chat/fuselage-tokens/dist/typography';

// Import the conversion functions from the functions module
import { toRem } from './functions';

// Function to get font family
const fontFamily = (name) => {
  if (!typography.$fontFamilies[name]) {
    throw new Error('Invalid font family name');
  }

  //   return css`
  //     :root {
  //       --rcx-font-family-${name}: ${typography.$fontFamilies[name]};
  //     }
  //   `;
};

// Get font scales keys
const fontScales = Object.keys(typography.$fontScales);

// Mixin to use font scale
const useFontScale = (name) => {
  if (!typography.$fontScales[name]) {
    throw new Error('Invalid font scale name');
  }

  const { letterSpacing, fontSize, fontWeight, lineHeight } =
    typography.$fontScales[name];

  return css`
    letter-spacing: ${toRem(letterSpacing)};
    font-size: ${toRem(fontSize)};
    font-weight: ${fontWeight};
    line-height: ${toRem(lineHeight)};
  `;
};

// Functions to get specific typography values
const letterSpacing = (name) => {
  if (!typography.$fontScales[name]) {
    throw new Error('Invalid font scale name');
  }

  return toRem(typography.$fontScales[name].letterSpacing);
};

const fontSize = (name) => {
  if (!typography.$fontScales[name]) {
    throw new Error('Invalid font scale name');
  }

  return toRem(typography.$fontScales[name].fontSize);
};

const fontWeight = (name) => {
  if (!typography.$fontScales[name]) {
    throw new Error('Invalid font scale name');
  }

  return typography.$fontScales[name].fontWeight;
};

const lineHeight = (name) => {
  if (!typography.$fontScales[name]) {
    throw new Error('Invalid font scale name');
  }

  return toRem(typography.$fontScales[name].lineHeight);
};

// Mixin for text ellipsis
const useTextEllipsis = () => css`
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Mixin for truncated text
const useWithTruncatedText = () => css`
  ${useTextEllipsis()};
  white-space: nowrap;
`;

// Export the converted functions and mixins
export {
  css,
  fontFamily,
  useFontScale,
  letterSpacing,
  fontSize,
  fontWeight,
  lineHeight,
  useTextEllipsis,
  useWithTruncatedText,
};
