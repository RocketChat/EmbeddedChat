import { css } from '@emotion/react';
import * as UiKit from '@rocket.chat/ui-kit';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Box, Button, useComponentOverrides } from '@embeddedchat/ui-elements';

import { useSurfaceType } from '../hooks/useSurfaceType';
import Action from './ActionsBlock.Action';

const ActionsBlock = ({ className, block, surfaceRenderer }) => {
  const { classNames, styleOverrides } = useComponentOverrides('ActionBlock');
  const ActionBlockCss = css`
    display: flex;
    flex-wrap: wrap;
  `;
  const surfaceType = useSurfaceType();

  const [showMoreVisible, setShowMoreVisible] = useState(
    () => block.elements.length > 5 && surfaceType !== 'banner'
  );

  const handleShowMoreClick = useCallback(() => {
    setShowMoreVisible(false);
  }, []);

  const actionElements = useMemo(
    () =>
      (showMoreVisible ? block.elements.slice(0, 5) : block.elements).map(
        (element) => ({
          ...element,
          appId: element.appId ?? block.appId,
          blockId: element.blockId ?? block.blockId,
        })
      ),
    [block.appId, block.blockId, block.elements, showMoreVisible]
  );

  return (
    <Box
      css={ActionBlockCss}
      className={`ec-action-block ${className} ${classNames}`}
      style={styleOverrides}
    >
      {actionElements.map((element, i) => (
        <Action key={i} element={element} parser={surfaceRenderer} index={i} />
      ))}
      {showMoreVisible && (
        <Box style={{ display: 'flex', margin: '0.125rem' }}>
          <Button size="small" type="secondary" onClick={handleShowMoreClick}>
            {surfaceRenderer.renderTextObject(
              { type: 'plain_text', text: 'Show more...' },
              0,
              UiKit.BlockContext.NONE
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default memo(ActionsBlock);
