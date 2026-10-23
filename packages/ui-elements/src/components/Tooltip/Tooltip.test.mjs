import test from 'node:test';
import assert from 'node:assert/strict';

// Helper mirroring Tooltip's text formatting logic
const formatTooltipText = (text) => {
  const hasText = Boolean(
    text && (typeof text === 'string' ? text.trim().length > 0 : true)
  );
  const formattedText =
    typeof text === 'string' && text.length > 0
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text;

  return { hasText, formattedText };
};

test('Tooltip formatTooltipText: safely handles undefined without throwing charAt TypeError', () => {
  assert.doesNotThrow(() => {
    const { hasText, formattedText } = formatTooltipText(undefined);
    assert.strictEqual(hasText, false);
    assert.strictEqual(formattedText, undefined);
  });
});

test('Tooltip formatTooltipText: safely handles null without throwing TypeError', () => {
  assert.doesNotThrow(() => {
    const { hasText, formattedText } = formatTooltipText(null);
    assert.strictEqual(hasText, false);
    assert.strictEqual(formattedText, null);
  });
});

test('Tooltip formatTooltipText: safely marks empty string as hasText = false', () => {
  const { hasText, formattedText } = formatTooltipText('');
  assert.strictEqual(hasText, false);
  assert.strictEqual(formattedText, '');
});

test('Tooltip formatTooltipText: marks whitespace-only string as hasText = false', () => {
  const { hasText } = formatTooltipText('   ');
  assert.strictEqual(hasText, false);
});

test('Tooltip formatTooltipText: capitalizes first letter of valid tooltip string', () => {
  const { hasText, formattedText } = formatTooltipText('pinned');
  assert.strictEqual(hasText, true);
  assert.strictEqual(formattedText, 'Pinned');
});

test('Tooltip formatTooltipText: preserves already capitalized string', () => {
  const { hasText, formattedText } = formatTooltipText('Followers (3)');
  assert.strictEqual(hasText, true);
  assert.strictEqual(formattedText, 'Followers (3)');
});

