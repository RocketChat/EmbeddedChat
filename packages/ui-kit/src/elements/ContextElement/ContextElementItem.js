import React from 'react';
import { css } from '@emotion/react';
import { BlockContext, ElementType } from '@rocket.chat/ui-kit';
import { Box } from '@embeddedchat/ui-elements';

export const ContextElementItem = ({ element, surfaceRenderer, index }) => {
  const renderedElement = surfaceRenderer.renderContext(
    element,
    BlockContext.CONTEXT,
    undefined,
    index
  );

  if (!renderedElement) {
    return null;
  }

  const MarkdownCSS = css`
    display: inline-block;
    font-size: 0.8rem;
    margin: -0.25rem;
  `;

  switch (element.type) {
    case ElementType.PLAIN_TEXT:
    case ElementType.MARKDOWN:
      return <Box css={MarkdownCSS}>{renderedElement}</Box>;

    default:
      return <>{renderedElement}</>;
  }
};
