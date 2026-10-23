const getIconSize = (iconSize, buttonSize) => {
  if (typeof iconSize === 'string') {
    if (iconSize === 'small') {
      return '1rem';
    }
    if (iconSize === 'medium') {
      return '1.25rem';
    }
    if (iconSize === 'large') {
      return '1.75rem';
    }
    return iconSize;
  }
  if (iconSize && typeof iconSize === 'object') {
    if (iconSize.size) {
      return iconSize.size;
    }
    if (iconSize.small) {
      return '1rem';
    }
    if (iconSize.large) {
      return '1.75rem';
    }
  }
  if (buttonSize === 'small') {
    return '1rem';
  }
  if (buttonSize === 'large') {
    return '1.75rem';
  }
  return '1.25rem';
};

export default getIconSize;

