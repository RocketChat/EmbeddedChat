import MessageSurface from './MessageSurface';
import ModalSurface from './ModalSurface';
import { createSurfaceRenderer } from './createSurfaceRenderer';
import { FuselageMessageSurfaceRenderer } from './MessageSurfaceRenderer';
import { ModalSurfaceRenderer } from './ModalSurfaceRenderer';
import ContextualBarSurface from './ContextualBarSurface';
import { ContextualBarSurfaceRenderer } from './ContextualBarSurfaceRenderer';

export const messageParser = new FuselageMessageSurfaceRenderer();
export const modalParser = new ModalSurfaceRenderer();
export const contextualBarParser = new ContextualBarSurfaceRenderer();

export const UiKitMessage = createSurfaceRenderer(
  MessageSurface,
  messageParser
);
export const UiKitModal = createSurfaceRenderer(ModalSurface, modalParser);
export const UiKitContextualBar = createSurfaceRenderer(
  ContextualBarSurface,
  contextualBarParser
);
