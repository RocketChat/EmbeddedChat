import * as UiKit from '@rocket.chat/ui-kit';
import {
  isPreviewBlockWithThumb,
  isPreviewBlockWithPreview,
} from '@rocket.chat/ui-kit';
import React, { memo } from 'react';
import {
  Box,
  MessageGenericPreviewCoverImage,
  MessageGenericPreview,
  MessageGenericPreviewThumb,
  MessageGenericPreviewContent,
  MessageGenericPreviewTitle,
  MessageGenericPreviewDescription,
  MessageGenericPreviewFooter,
} from '@embeddedchat/ui-elements';

import ContextBlock from './ContextBlock';

const PreviewBlock = ({ block, surfaceRenderer }) => (
  <Box>
    <MessageGenericPreview>
      {isPreviewBlockWithPreview(block) && block.preview?.dimensions && (
        <MessageGenericPreviewCoverImage
          width={block.preview.dimensions.width}
          height={block.preview.dimensions.height}
          url={block.preview.url}
        />
      )}
      <MessageGenericPreviewContent
        thumb={
          isPreviewBlockWithThumb(block) ? (
            <MessageGenericPreviewThumb>
              <MessageGenericPreviewCoverImage
                height={192}
                width={368}
                url={block.thumb.url}
              />
            </MessageGenericPreviewThumb>
          ) : undefined
        }
      >
        {Array.isArray(block.title) ? (
          <MessageGenericPreviewTitle
            externalUrl={
              isPreviewBlockWithPreview(block) ? block.externalUrl : undefined
            }
          >
            {block.title.map((title, index) =>
              surfaceRenderer.renderTextObject(
                title,
                index,
                UiKit.BlockContext.NONE
              )
            )}
          </MessageGenericPreviewTitle>
        ) : null}
        {Array.isArray(block.description) ? (
          <MessageGenericPreviewDescription clamp>
            {block.description.map((description) =>
              surfaceRenderer.renderTextObject(
                description,
                0,
                UiKit.BlockContext.NONE
              )
            )}
          </MessageGenericPreviewDescription>
        ) : null}
        {block.footer && (
          <MessageGenericPreviewFooter>
            <ContextBlock
              block={block.footer}
              surfaceRenderer={surfaceRenderer}
              context={UiKit.BlockContext.BLOCK}
              index={0}
            />
          </MessageGenericPreviewFooter>
        )}
      </MessageGenericPreviewContent>
    </MessageGenericPreview>
  </Box>
);

export default memo(PreviewBlock);
