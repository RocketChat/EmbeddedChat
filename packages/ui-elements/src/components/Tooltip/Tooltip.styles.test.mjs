import test from 'node:test';
import assert from 'node:assert/strict';
import getTooltipStyles from './Tooltip.styles.js';

const mockTheme = {
  radius: '4px',
  invertedColors: {
    secondary: '#1f2328',
    secondaryForeground: '#ffffff',
  },
  zIndex: {
    tooltip: 1400,
  },
};

test('Tooltip.styles: centers tooltip horizontally with left: 50% and translateX(-50%)', () => {
  const styles = getTooltipStyles(mockTheme, 'top');
  const tooltipCss = styles.tooltip.styles;

  assert.match(tooltipCss, /left:\s*50%/);
  assert.match(tooltipCss, /transform:\s*translateX\(-50%\)/);
  assert.doesNotMatch(
    tooltipCss,
    /left:\s*64%/,
    'Should not use hardcoded 64% offset'
  );
});

test('Tooltip.styles: positions top tooltip above anchor element', () => {
  const styles = getTooltipStyles(mockTheme, 'top');
  const tooltipCss = styles.tooltip.styles;
  const arrowCss = styles.tooltipArrow.styles;

  assert.match(tooltipCss, /bottom:\s*calc\(100%\s*\+\s*8px\)/);
  assert.match(arrowCss, /top:\s*100%/);
  assert.match(arrowCss, /transform:\s*translateX\(-50%\)/);
});

test('Tooltip.styles: positions bottom tooltip below anchor element with inverted arrow', () => {
  const styles = getTooltipStyles(mockTheme, 'bottom');
  const tooltipCss = styles.tooltip.styles;
  const arrowCss = styles.tooltipArrow.styles;

  assert.match(tooltipCss, /top:\s*calc\(100%\s*\+\s*8px\)/);
  assert.match(arrowCss, /bottom:\s*100%/);
  assert.match(arrowCss, /rotate\(180deg\)/);
});

test('Tooltip.styles: normalizes position "down" to behave identically to "bottom"', () => {
  const downStyles = getTooltipStyles(mockTheme, 'down');
  const bottomStyles = getTooltipStyles(mockTheme, 'bottom');

  assert.strictEqual(downStyles.tooltip.styles, bottomStyles.tooltip.styles);
  assert.strictEqual(
    downStyles.tooltipArrow.styles,
    bottomStyles.tooltipArrow.styles
  );
});

test('Tooltip.styles: defaults to "top" position when position argument is omitted', () => {
  const defaultStyles = getTooltipStyles(mockTheme);
  const topStyles = getTooltipStyles(mockTheme, 'top');

  assert.strictEqual(defaultStyles.tooltip.styles, topStyles.tooltip.styles);
  assert.strictEqual(
    defaultStyles.tooltipArrow.styles,
    topStyles.tooltipArrow.styles
  );
});

test('Tooltip.styles: includes pointer-events: none to avoid hover jitter and blocking clicks', () => {
  const styles = getTooltipStyles(mockTheme, 'top');
  assert.match(styles.tooltip.styles, /pointer-events:\s*none/);
});
