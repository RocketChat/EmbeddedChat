export const isValidCssDimension = (value: string): boolean => {
    const cssDimensionRegex =
        /^(auto|inherit|initial|unset|0|[+-]?(\d+|\d*\.\d+)(px|em|rem|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex))$/;
    return cssDimensionRegex.test(value);
};
