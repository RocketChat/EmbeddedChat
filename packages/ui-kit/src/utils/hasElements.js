const LayoutBlockWithElements = (block) =>
  'elements' in block && Array.isArray(block.elements);

export const hasElements = (block) => LayoutBlockWithElements(block);
