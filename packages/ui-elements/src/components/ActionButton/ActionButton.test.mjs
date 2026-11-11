import test from 'node:test';
import assert from 'node:assert/strict';
import getIconSize from './getIconSize.js';

test('ActionButton: derives small icon size (1rem) for small action button to prevent container overflow', () => {
  assert.strictEqual(getIconSize({}, 'small'), '1rem');
});

test('ActionButton: derives medium icon size (1.25rem) by default', () => {
  assert.strictEqual(getIconSize({}, 'medium'), '1.25rem');
  assert.strictEqual(getIconSize(), '1.25rem');
});

test('ActionButton: derives large icon size (1.75rem) for large action button', () => {
  assert.strictEqual(getIconSize({}, 'large'), '1.75rem');
});

test('ActionButton: supports named iconSize strings ("small", "medium", "large")', () => {
  assert.strictEqual(getIconSize('small', 'medium'), '1rem');
  assert.strictEqual(getIconSize('medium', 'medium'), '1.25rem');
  assert.strictEqual(getIconSize('large', 'medium'), '1.75rem');
});

test('ActionButton: supports custom iconSize css length string', () => {
  assert.strictEqual(getIconSize('1.4rem', 'medium'), '1.4rem');
  assert.strictEqual(getIconSize('18px', 'small'), '18px');
});

test('ActionButton: supports legacy object syntax { small: true } and { large: true }', () => {
  assert.strictEqual(getIconSize({ small: true }), '1rem');
  assert.strictEqual(getIconSize({ large: true }), '1.75rem');
});

test('ActionButton: supports explicit size property in iconSize object { size: "1.3rem" }', () => {
  assert.strictEqual(getIconSize({ size: '1.3rem' }), '1.3rem');
});
