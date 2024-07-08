import React from 'react';
import { css } from '@emotion/react';
import * as UiKit from '@rocket.chat/ui-kit';
import { Box, useComponentOverrides } from '@embeddedchat/ui-elements';

const Action = ({ element, parser, index }) => {
  const { classNames, styleOverrides } =
    useComponentOverrides('ActionBlockAction');
  const classNameBox = css`
    display: flex;
    margin: 0.25rem;
    ${element.type !== UiKit.BlockElementType.BUTTON ? `flex-grow: 1;` : ``};
    ${element.type !== UiKit.BlockElementType.BUTTON ? `flex-basis: 45%;` : ``};
  `;
  const renderedElement = parser.renderActionsBlockElement(element, index);

  if (!renderedElement) {
    return null;
  }

  return (
    <Box css={classNameBox} style={styleOverrides} className={classNames}>
      {renderedElement}
    </Box>
  );
};

export default Action;
