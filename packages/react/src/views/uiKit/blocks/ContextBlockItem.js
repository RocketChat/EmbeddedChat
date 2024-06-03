import React from 'react';
import { css } from '@emotion/react';
import * as UiKit from '@rocket.chat/ui-kit';
import useComponentOverrides from '../../../hooks/useComponentOverrides';
import { Box } from '../../../components/Box';
import { ContextBlockItemStyles as styles } from './blocks.styles';

const Item = ({ block: element, surfaceRenderer: parser, index }) => {
  const { classNames, styleOverrides } =
    useComponentOverrides('ContextBlockItem');

  const renderedElement = parser.renderContextBlockElement(element, index);

  if (!renderedElement) {
    return null;
  }

  switch (element.type) {
    case UiKit.TextObjectType.PLAIN_TEXT:
    case UiKit.TextObjectType.MARKDOWN:
      return (
        <Box
          css={styles.ContextBlock}
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
