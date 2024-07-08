import React, { memo, useMemo } from 'react';
import { Box, Flex, Grid } from '@embeddedchat/ui-elements';

import Fields from './SectionBlock.Fields';

const SectionBlock = ({ className, block, surfaceRenderer }) => {
  const { text, fields } = block;

  const accessoryElement = useMemo(
    () =>
      block.accessory
        ? {
            appId: block.appId,
            blockId: block.blockId,
            ...block.accessory,
          }
        : undefined,
    [block.appId, block.blockId, block.accessory]
  );

  return (
    <Grid
      className={className}
      cols={(text || fields) && block.accessory ? 2 : 1}
      gap="10px"
    >
      <Grid.Item>
        {text && <Box>{surfaceRenderer.text(text)}</Box>}
        {fields && <Fields fields={fields} surfaceRenderer={surfaceRenderer} />}
      </Grid.Item>
      {block.accessory && (
        <Flex.Item grow={0}>
          <Grid.Item
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.25rem',
            }}
          >
            {accessoryElement
              ? surfaceRenderer.renderSectionAccessoryBlockElement(
                  accessoryElement,
                  0
                )
              : null}
          </Grid.Item>
        </Flex.Item>
      )}
    </Grid>
  );
};

export default memo(SectionBlock);
