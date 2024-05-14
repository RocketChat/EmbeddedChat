import * as UiKit from '@rocket.chat/ui-kit';
import { renderToStaticMarkup } from 'react-dom/server';

export const fromTextObjectToString = (surfaceRenderer, textObject, index) => {
  const element = surfaceRenderer.renderTextObject(
    textObject,
    index,
    UiKit.BlockContext.NONE
  );

  if (!element) {
    return undefined;
  }

  return renderToStaticMarkup(element);
};
