import React, { memo, useMemo } from 'react';
import { Box } from '../../components/Box';
import Flex from '../../components/Flex';
import { Grid } from '../../components/Grid';

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
    <Grid className={className}>
      <Grid.Item>
        {text && <Box>{surfaceRenderer.text(text)}</Box>}
        {fields && <Fields fields={fields} surfaceRenderer={surfaceRenderer} />}
      </Grid.Item>
      {block.accessory && (
        <Flex.Item grow={0}>
          <Grid.Item>
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
