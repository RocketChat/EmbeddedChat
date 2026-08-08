import test from 'node:test';
import assert from 'node:assert/strict';
import DefaultTheme from '../theme/DefaultTheme.js';
import generateThemeFromColor, {
  applyThemeRefinement,
  applyThemePaletteChange,
  colorToHex,
  getAccessibilityReport,
  isValidTheme,
  normalizeHex,
} from './generateThemeFromColor.js';
import {
  applyExplicitInitialIntent,
  createLocalSuggestion,
  limitRefinementSuggestion,
  requestThemeSuggestion,
  validateThemeSuggestion,
} from './themeGenerationService.js';

test('normalizes accepted three and six digit hex colors', () => {
  assert.equal(normalizeHex('abc'), '#aabbcc');
  assert.equal(normalizeHex('#0F10aa'), '#0f10aa');
  assert.equal(normalizeHex('blue'), null);
});

test('converts generated HSL tokens to color input values', () => {
  assert.equal(colorToHex('hsl(0, 0%, 100%)'), '#ffffff');
  assert.equal(colorToHex('hsl(0, 0%, 0%)'), '#000000');
  assert.equal(colorToHex('not-a-color'), null);
});

test('generates complete accessible light and dark EmbeddedChat schemes', () => {
  const theme = generateThemeFromColor('#2563eb', DefaultTheme, {
    accentHex: '#f97316',
    radius: '0.5rem',
  });
  const report = getAccessibilityReport(theme);

  assert.equal(theme.radius, '0.5rem');
  assert.ok(theme.schemes.light.primary);
  assert.ok(theme.schemes.dark.primary);
  assert.equal(report.length, 16);
  assert.ok(report.every((result) => result.passes));
});

test('keeps saturated dark-mode primary actions above the AA contrast threshold', () => {
  const theme = generateThemeFromColor('#000f94', DefaultTheme);
  const darkPrimary = getAccessibilityReport(theme).find(
    (result) => result.label === 'Dark Primary action'
  );

  assert.ok(darkPrimary.passes);
  assert.ok(darkPrimary.ratio >= 4.5);
});

test('refinement only changes requested theme tokens', () => {
  const original = generateThemeFromColor('#2563eb', DefaultTheme, {
    accentHex: '#f97316',
  });
  const refined = applyThemeRefinement(original, { radius: '1.5rem' });

  assert.equal(refined.radius, '1.5rem');
  assert.deepEqual(refined.schemes, original.schemes);
  assert.deepEqual(refined.typography, original.typography);
});

test('color refinement does not replace unrelated semantic tokens', () => {
  const original = generateThemeFromColor('#2563eb', DefaultTheme, {
    accentHex: '#f97316',
  });
  const refined = applyThemeRefinement(original, { primaryHex: '#dc2626' });

  assert.notEqual(refined.schemes.light.primary, original.schemes.light.primary);
  assert.notEqual(refined.schemes.dark.primary, original.schemes.dark.primary);
  assert.equal(refined.schemes.light.accent, original.schemes.light.accent);
  assert.equal(refined.schemes.dark.background, original.schemes.dark.background);
  assert.ok(getAccessibilityReport(refined).every((result) => result.passes));
});

test('palette changes only update the selected mode and repair paired text', () => {
  const original = generateThemeFromColor('#2563eb', DefaultTheme);
  const refined = applyThemePaletteChange(original, {
    mode: 'dark',
    token: 'accent',
    value: '#ffffff',
  });

  assert.equal(refined.schemes.dark.accent, '#ffffff');
  assert.equal(refined.schemes.dark.accentForeground, 'hsl(0, 0%, 0%)');
  assert.equal(refined.schemes.light.accent, original.schemes.light.accent);
  assert.ok(isValidTheme(refined));
});

test('generated usernames and timestamps are readable on both chat backgrounds', () => {
  const theme = generateThemeFromColor('#0003e5', DefaultTheme);
  const metadataChecks = getAccessibilityReport(theme).filter((result) =>
    /Username link|Message metadata/.test(result.label)
  );

  assert.equal(metadataChecks.length, 4);
  assert.ok(metadataChecks.every((result) => result.passes));
});

test('only allows a narrow provider response contract', () => {
  assert.deepEqual(
    validateThemeSuggestion({
      primaryHex: '#123456',
      accentHex: '#abcdef',
      radius: '0.25rem',
      mode: 'dark',
      fontFamily: 'Arial, Helvetica, sans-serif',
      messageView: undefined,
      displayName: undefined,
      arbitraryCss: 'url(javascript:alert(1))',
    }),
    {
      primaryHex: '#123456',
      accentHex: '#abcdef',
      radius: '0.25rem',
      mode: 'dark',
      fontFamily: 'Arial, Helvetica, sans-serif',
      messageView: undefined,
      displayName: undefined,
    }
  );
  assert.throws(() => validateThemeSuggestion({ primaryHex: 'invalid' }));
});

test('local fallback extracts developer-provided theme intent without network access', () => {
  assert.deepEqual(
    createLocalSuggestion('A dark purple theme with amber accent and rounded corners'),
    {
      primaryHex: '#a855f7',
      accentHex: '#f59e0b',
      radius: '0.5rem',
      fontFamily: undefined,
      mode: 'dark',
      messageView: undefined,
      displayName: undefined,
    }
  );
});

test('initial prompts enforce explicit visual intent over an adapter response', () => {
  assert.deepEqual(
    applyExplicitInitialIntent(
      {
        primaryHex: '#ef4444',
        accentHex: '#22c55e',
        radius: '0rem',
        fontFamily: 'Georgia, "Times New Roman", serif',
        mode: 'light',
      },
      'violet theme with light blue accents, dark theme, pill shaped corners, professional font'
    ),
    {
      primaryHex: '#8b5cf6',
      accentHex: '#3b82f6',
      radius: '1.5rem',
      fontFamily: 'Arial, Helvetica, sans-serif',
      mode: 'dark',
    }
  );
});

test('local follow-ups only return tokens that the developer asked to change', () => {
  assert.deepEqual(
    createLocalSuggestion('make it pill-shaped and light', {
      preserveExisting: true,
    }),
    {
      primaryHex: undefined,
      accentHex: undefined,
      radius: '1.5rem',
      fontFamily: undefined,
      mode: 'light',
      messageView: undefined,
      displayName: undefined,
    }
  );
});

test('initial prompts apply explicit message view intent', () => {
  assert.equal(
    applyExplicitInitialIntent(
      { messageView: 'flat' },
      'cool violet with blue accent, square shaped corners, dark theme, mono font, bubble type message view'
    ).messageView,
    'bubble'
  );
});

test('model follow-ups cannot overwrite token types that were not requested', () => {
  assert.deepEqual(
    limitRefinementSuggestion(
      {
        primaryHex: '#ef4444',
        accentHex: '#22c55e',
        radius: '1.5rem',
        fontFamily: 'Georgia, "Times New Roman", serif',
        mode: 'light',
      },
      'Keep the palette and make the corners pill-shaped'
    ),
    { radius: '1.5rem' }
  );
});

test('an explicit light or dark mode refinement overrides an adapter response', () => {
  assert.deepEqual(
    limitRefinementSuggestion(
      { mode: 'dark', primaryHex: '#ef4444' },
      'Switch to light theme'
    ),
    { mode: 'light' }
  );
  assert.deepEqual(
    limitRefinementSuggestion(
      { mode: 'light', accentHex: '#22c55e' },
      'Switch to dark theme'
    ),
    { mode: 'dark' }
  );
});

test('explicit corner and font refinements override an adapter response', () => {
  assert.deepEqual(
    limitRefinementSuggestion(
      { radius: '0rem', fontFamily: 'Arial, Helvetica, sans-serif' },
      'Make the corners pill-shaped and use a serif font'
    ),
    { radius: '1.5rem', fontFamily: 'Georgia, "Times New Roman", serif' }
  );
});

test('does not allow direct Ollama connections to non-local hosts', async () => {
  await assert.rejects(
    requestThemeSuggestion({
      description: 'blue theme',
      baseUrl: 'http://theme.example.com',
      model: 'gemma4',
    }),
    /restricted to your local machine/
  );
});
