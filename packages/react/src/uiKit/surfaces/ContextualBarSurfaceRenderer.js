import { FuselageSurfaceRenderer } from './FuselageSurfaceRenderer';

class ContextualBarSurfaceRenderer extends FuselageSurfaceRenderer {
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
      'tab_navigation',
    ]);
  }
}

export { ContextualBarSurfaceRenderer };
