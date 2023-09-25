import React from 'react';
import { css } from '@emotion/react';
import * as UiKit from '@rocket.chat/ui-kit';
import useComponentOverrides from '../../../theme/useComponentOverrides';
import { Box } from '../../Box';

const Item = ({ block: element, surfaceRenderer: parser, index }) => {
  const { classNames, styleOverrides } =
    useComponentOverrides('ContextBlockItem');
  const ContextBlockCss = css`
    display: inline-block;
    font-size: 0.8rem;
    color: #ffffff3f;
    margin: -0.25rem;
  `;
  const renderedElement = parser.renderContextBlockElement(element, index);

  if (!renderedElement) {
    return null;
  }

  switch (element.type) {
    case UiKit.TextObjectType.PLAIN_TEXT:
    case UiKit.TextObjectType.MARKDOWN:
      return (
        <Box
          css={ContextBlockCss}
          className={`ec-context-block-item ${classNames}`}
          style={styleOverrides}
        >
          {renderedElement}
        </Box>
      );

    default:
      return renderedElement;
  }
};

export default Item;
