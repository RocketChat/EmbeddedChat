import { FuselageSurfaceRenderer } from './FuselageSurfaceRenderer';

export class FuselageModalSurfaceRenderer extends FuselageSurfaceRenderer {
  constructor() {
    super([
      'actions',
      'context',
      'divider',
      'image',
      'input',
      'section',
      'preview',
      'callout',
    ]);
  }
}
