const isStringArray = (value) => Array.isArray(value);

export const appendClassNames = (className, currentClassNames) => {
  if (isStringArray(currentClassNames)) {
    return [className, ...currentClassNames];
  }

  if (currentClassNames) {
    return `${className} ${currentClassNames}`;
  }

  return className;
};
