import { FuselageSurfaceRenderer } from './FuselageSurfaceRenderer';

export class FuselageMessageSurfaceRenderer extends FuselageSurfaceRenderer {
  constructor() {
    super([
      'actions',
      'context',
      'divider',
      'image',
      'input',
      'section',
      'preview',
      'video_conf',
    ]);
  }

  video_conf() {
    return null;
  }
}
