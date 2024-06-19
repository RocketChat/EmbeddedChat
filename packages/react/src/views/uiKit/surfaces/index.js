import MessageSurface from './MessageSurface';
import ModalSurface from './ModalSurface';
import { createSurfaceRenderer } from './createSurfaceRenderer';
import { FuselageMessageSurfaceRenderer } from './MessageSurfaceRenderer';
import { FuselageModalSurfaceRenderer } from './FuselageModalSurfaceRenderer';

export const messageParser = new FuselageMessageSurfaceRenderer();
export const modalParser = new FuselageModalSurfaceRenderer();

export const UiKitMessage = createSurfaceRenderer(
  MessageSurface,
  messageParser
);
export const UiKitModal = createSurfaceRenderer(ModalSurface, modalParser);
