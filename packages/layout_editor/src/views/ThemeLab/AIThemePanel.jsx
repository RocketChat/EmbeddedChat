import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  StaticSelect,
  useTheme,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import generateThemeFromColor, {
  applyThemeRefinement,
  applyThemePaletteChange,
  colorToHex,
  getAccessibilityReport,
  isValidTheme,
  normalizeHex,
} from '../../lib/generateThemeFromColor';
import {
  requestThemeSuggestion,
  THEME_PROVIDERS,
} from '../../lib/themeGenerationService';
import { copyThemeToClipboard, downloadTheme } from '../../lib/themeExport';
import { getAIThemePanelStyles } from './AIThemePanel.styles';
import ColorPicker from './ColorPicker';
import {
  DISPLAY_NAME_OPTIONS,
  FONT_FAMILY_OPTIONS,
  MESSAGE_VIEW_OPTIONS,
} from './themeOptions';
import useLayoutStore from '../../store/layoutStore';

const SWATCH_KEYS = [
  { key: 'background', label: 'Background' },
  { key: 'card', label: 'Card' },
  { key: 'primary', label: 'Primary' },
  { key: 'accent', label: 'Accent' },
  { key: 'foreground', label: 'Text' },
];

const RADIUS_OPTIONS = [
  ['0rem', 'Square'],
  ['0.25rem', 'Soft'],
  ['0.5rem', 'Round'],
  ['1.5rem', 'Pill'],
];

const PALETTE_GROUPS = [
  {
    label: 'Surfaces',
    tokens: [
      ['background', 'Background'], ['foreground', 'Text'],
      ['card', 'Card'], ['cardForeground', 'Card text'],
      ['popover', 'Popover'], ['popoverForeground', 'Popover text'],
      ['border', 'Border'], ['input', 'Input border'], ['ring', 'Focus ring'],
    ],
  },
  {
    label: 'Actions',
    tokens: [
      ['primary', 'Primary'], ['primaryForeground', 'Primary text'],
      ['secondary', 'Secondary'], ['secondaryForeground', 'Secondary text'],
      ['accent', 'Accent'], ['accentForeground', 'Accent text'],
      ['muted', 'Muted'], ['mutedForeground', 'Muted text'],
    ],
  },
  {
    label: 'Feedback',
    tokens: [
      ['destructive', 'Destructive'], ['destructiveForeground', 'Destructive text'],
      ['warning', 'Warning'], ['warningForeground', 'Warning text'],
      ['success', 'Success'], ['successForeground', 'Success text'],
      ['info', 'Info'], ['infoForeground', 'Info text'],
    ],
  },
];

const DEFAULT_OLLAMA_URL =
  import.meta.env.VITE_OLLAMA_BASE_URL ?? 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL ?? 'gemma4';
const REQUEST_TIMEOUT_MS = 15_000;

const mergeSuggestions = (previous, next) =>
  Object.fromEntries(
    Object.entries({ ...previous, ...next }).filter(
      ([key, value]) => key !== 'source' && value !== undefined
    )
  );

const AIThemePanel = () => {
  const { theme, mode, setTheme, setMode } = useTheme();
  const { messageView, displayName, setMessageView, setDisplayName } =
    useLayoutStore((state) => ({
      messageView: state.messageView,
      displayName: state.displayName,
      setMessageView: state.setMessageView,
      setDisplayName: state.setDisplayName,
    }));
  const styles = getAIThemePanelStyles(theme);
  const dispatchToastMessage = useToastBarDispatch();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('ollama');
  const [ollamaUrl, setOllamaUrl] = useState(DEFAULT_OLLAMA_URL);
  const [ollamaModel, setOllamaModel] = useState(DEFAULT_OLLAMA_MODEL);
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudModel, setCloudModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [followUp, setFollowUp] = useState('');
  const [visiblePalettePicker, setVisiblePalettePicker] = useState(null);
  const [paletteMode, setPaletteMode] = useState(mode);
  const [draftHistory, setDraftHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('Describe a brand direction to create a reviewable theme draft.');
  const originalThemeRef = useRef(null);
  const controllerRef = useRef(null);
  const paletteEditRef = useRef(null);
  const palettePickerRef = useRef(null);

  const endPaletteEdit = useCallback(() => {
    paletteEditRef.current = null;
  }, []);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (palettePickerRef.current && !palettePickerRef.current.contains(event.target)) {
        setVisiblePalettePicker(null);
        endPaletteEdit();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [endPaletteEdit]);

  const createDraft = useCallback(async ({
    description,
    context = [],
    baseTheme,
    previousSuggestion,
    variants,
  }) => {
    if (!description || isGenerating) return null;
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );
    controllerRef.current = controller;
    setIsGenerating(true);
    setStatus('Creating a theme draft…');

    try {
      const suggestion = await requestThemeSuggestion({
        description,
        context: context.length ? context.join('\n') : undefined,
        provider,
        baseUrl: provider === 'ollama' ? ollamaUrl.trim() : cloudUrl.trim(),
        model: provider === 'ollama' ? ollamaModel.trim() : cloudModel.trim(),
        apiKey,
        preserveExisting: Boolean(previousSuggestion),
        signal: controller.signal,
      });
      const mergedSuggestion = mergeSuggestions(previousSuggestion, suggestion);
      const generatedTheme = previousSuggestion
        ? applyThemeRefinement(baseTheme, suggestion)
        : generateThemeFromColor(
            mergedSuggestion.primaryHex,
            baseTheme,
            mergedSuggestion
          );
      if (!generatedTheme || !isValidTheme(generatedTheme)) {
        throw new Error('The generated theme did not pass accessibility validation.');
      }

      const generatedMode = mergedSuggestion.mode ?? mode;
      const nextCandidate = {
        theme: generatedTheme,
        mode: generatedMode,
        source: suggestion.source,
        report: getAccessibilityReport(generatedTheme),
        suggestion: mergedSuggestion,
        context: [...context, description],
        variants: {
          messageView: mergedSuggestion.messageView ?? variants.messageView,
          displayName: mergedSuggestion.displayName ?? variants.displayName,
        },
      };
      setStatus(
        suggestion.source === 'fallback'
          ? 'Fallback draft ready. Select an adapter for model-assisted suggestions.'
          : `${THEME_PROVIDERS[suggestion.source].label} draft ready. Review it before applying.`
      );
      return nextCandidate;
    } catch (error) {
      const message = error.name === 'AbortError'
        ? 'Generation timed out or was cancelled. Try again or check your theme service.'
        : error.message;
      setStatus(message);
      dispatchToastMessage({ type: 'error', message });
    } finally {
      window.clearTimeout(timeout);
      controllerRef.current = null;
      setIsGenerating(false);
    }
  }, [apiKey, cloudModel, cloudUrl, dispatchToastMessage, isGenerating, mode, ollamaModel, ollamaUrl, provider]);

  const handleProviderChange = useCallback((nextProvider) => {
    setProvider(nextProvider);
    const configuration = THEME_PROVIDERS[nextProvider];
    if (nextProvider === 'ollama') {
      setOllamaModel(configuration.model);
      return;
    }
    if (nextProvider !== 'fallback') {
      setCloudModel(configuration.model);
      setCloudUrl(configuration.baseUrl);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    const nextCandidate = await createDraft({
      description: prompt.trim(),
      baseTheme: theme,
      variants: { messageView, displayName },
    });
    if (!nextCandidate) return;
    setCandidate(nextCandidate);
    setPaletteMode(nextCandidate.mode);
    setDraftHistory([]);
    setFollowUp('');
    paletteEditRef.current = null;
  }, [createDraft, displayName, messageView, prompt, theme]);

  const handleFollowUp = useCallback(async () => {
    if (!candidate || !followUp.trim()) return;
    const nextCandidate = await createDraft({
      description: followUp.trim(),
      context: candidate.context,
      baseTheme: candidate.theme,
      previousSuggestion: candidate.suggestion,
      variants: candidate.variants,
    });
    if (!nextCandidate) return;
    setDraftHistory((history) => [candidate, ...history].slice(0, 5));
    setCandidate(nextCandidate);
    setPaletteMode(nextCandidate.mode);
    setFollowUp('');
    paletteEditRef.current = null;
  }, [candidate, createDraft, followUp]);

  const handleUndoDraft = useCallback(() => {
    if (!draftHistory.length) return;
    const [previous, ...remainingHistory] = draftHistory;
    setCandidate(previous);
    setPaletteMode(previous.mode);
    setDraftHistory(remainingHistory);
    setFollowUp('');
    paletteEditRef.current = null;
    setStatus('Restored the previous draft revision.');
  }, [draftHistory]);

  const handleCancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const handleApply = useCallback(() => {
    if (!candidate) return;
    if (!originalThemeRef.current) {
      originalThemeRef.current = { theme, mode };
    }
    setTheme(candidate.theme);
    setMode(candidate.mode);
    setMessageView(candidate.variants.messageView);
    setDisplayName(candidate.variants.displayName);
    setStatus('Theme applied. Export the JSON when you are ready to use it in your website.');
    dispatchToastMessage({ type: 'success', message: 'Accessible theme applied.' });
  }, [
    candidate,
    dispatchToastMessage,
    mode,
    setDisplayName,
    setMessageView,
    setMode,
    setTheme,
    theme,
  ]);

  const handleReset = useCallback(() => {
    if (!originalThemeRef.current) return;
    setTheme(originalThemeRef.current.theme);
    setMode(originalThemeRef.current.mode);
    originalThemeRef.current = null;
    setCandidate(null);
    setStatus('Restored the theme that was active before this generator was used.');
    dispatchToastMessage({ type: 'success', message: 'Theme restored.' });
  }, [dispatchToastMessage, setMode, setTheme]);

  const handleCopy = useCallback(async () => {
    const exportableTheme = candidate
      ? {
          ...candidate.theme,
          variants: {
            Message: candidate.variants.messageView,
            MessageHeader: candidate.variants.displayName,
          },
        }
      : theme;
    try {
      await copyThemeToClipboard(exportableTheme);
      dispatchToastMessage({ type: 'success', message: 'Theme JSON copied to clipboard.' });
    } catch (error) {
      dispatchToastMessage({ type: 'error', message: error.message });
    }
  }, [candidate, dispatchToastMessage, theme]);

  const handleDownload = useCallback(() => {
    const exportableTheme = candidate
      ? {
          ...candidate.theme,
          variants: {
            Message: candidate.variants.messageView,
            MessageHeader: candidate.variants.displayName,
          },
        }
      : theme;
    downloadTheme(exportableTheme);
    dispatchToastMessage({ type: 'success', message: 'Theme JSON downloaded.' });
  }, [candidate, dispatchToastMessage, theme]);

  const beginPaletteEdit = useCallback(() => {
    if (!candidate || paletteEditRef.current === candidate) return;
    setDraftHistory((history) => [candidate, ...history].slice(0, 5));
    paletteEditRef.current = candidate;
  }, [candidate]);

  const handlePaletteChange = useCallback((token, value) => {
    const color = normalizeHex(value);
    if (!candidate || !color) return;

    const nextTheme = applyThemePaletteChange(candidate.theme, {
      mode: paletteMode,
      token,
      value: color,
    });
    if (!nextTheme || !isValidTheme(nextTheme)) {
      setStatus('That color would fail accessibility validation. Try a different value or adjust its paired text token.');
      return;
    }

    const suggestionKey = token === 'primary'
      ? 'primaryHex'
      : token === 'accent'
        ? 'accentHex'
        : null;

    setCandidate({
      ...candidate,
      theme: nextTheme,
      report: getAccessibilityReport(nextTheme),
      suggestion: suggestionKey
        ? { ...candidate.suggestion, [suggestionKey]: color }
        : candidate.suggestion,
    });
    setStatus('Palette adjusted. All light and dark contrast checks still pass.');
  }, [candidate, paletteMode]);

  const handleStyleChange = useCallback((options) => {
    if (!candidate) return;
    const nextTheme = applyThemeRefinement(candidate.theme, options);
    if (!nextTheme || !isValidTheme(nextTheme)) return;

    setDraftHistory((history) => [candidate, ...history].slice(0, 5));
    setCandidate({
      ...candidate,
      theme: nextTheme,
      report: getAccessibilityReport(nextTheme),
      suggestion: { ...candidate.suggestion, ...options },
    });
    setStatus('Draft style updated.');
  }, [candidate]);

  const handleVariantChange = useCallback((variant, value) => {
    if (!candidate || candidate.variants[variant] === value) return;
    setDraftHistory((history) => [candidate, ...history].slice(0, 5));
    setCandidate({
      ...candidate,
      variants: { ...candidate.variants, [variant]: value },
    });
    setStatus('Draft layout updated.');
  }, [candidate]);

  const previewScheme = candidate?.theme.schemes[candidate.mode];
  const editableScheme = candidate?.theme.schemes[paletteMode];

  return (
    <Box css={styles.panel}>
      <button
        type="button"
        css={styles.header}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="ai-theme-generator-panel"
      >
        <Box css={styles.headerTitle}>
          <span aria-hidden="true">✦</span>
          <span>AI Theme Generator</span>
          <span css={styles.badge}>Beta</span>
        </Box>
        <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <Box id="ai-theme-generator-panel" css={styles.body}>
          <p css={styles.intro}>
            Generate an accessible EmbeddedChat theme, then tune it before applying.
          </p>

          <Box css={styles.sourceRow}>
            <label css={styles.providerLabel} htmlFor="theme-generator-provider">
              AI adapter
            </label>
            <select
              id="theme-generator-provider"
              css={styles.providerSelect}
              value={provider}
              onChange={(event) => handleProviderChange(event.target.value)}
            >
              {Object.entries(THEME_PROVIDERS).map(([key, configuration]) => (
                <option key={key} value={key}>{configuration.label}</option>
              ))}
            </select>
            <span css={styles.sourceHint}>
              {provider === 'ollama'
                ? 'No API key or proxy required.'
                : provider === 'fallback'
                  ? 'No AI request is made.'
                  : 'Credentials remain in memory and are never saved.'}
            </span>
          </Box>

          {provider !== 'fallback' && (
            <details css={styles.settingsDisclosure}>
              <summary>Connection settings</summary>
              {provider === 'ollama' && (
                <Box css={styles.providerSettings}>
              <label css={styles.fieldLabel} htmlFor="theme-generator-ollama-url">
                Ollama URL
              </label>
              <input
                id="theme-generator-ollama-url"
                css={styles.input}
                value={ollamaUrl}
                onChange={(event) => setOllamaUrl(event.target.value)}
                placeholder="http://localhost:11434"
                inputMode="url"
              />
              <label css={styles.fieldLabel} htmlFor="theme-generator-ollama-model">
                Ollama model
              </label>
              <input
                id="theme-generator-ollama-model"
                css={styles.input}
                value={ollamaModel}
                onChange={(event) => setOllamaModel(event.target.value)}
                placeholder="gemma4"
              />
              <p css={styles.hint}>
                Localhost only. Configure OLLAMA_ORIGINS if your browser reports CORS.
              </p>
                </Box>
              )}

              {provider !== 'ollama' && (
                <Box css={styles.providerSettings}>
              <label css={styles.fieldLabel} htmlFor="theme-generator-cloud-url">
                API base URL
              </label>
              <input
                id="theme-generator-cloud-url"
                css={styles.input}
                value={cloudUrl}
                onChange={(event) => setCloudUrl(event.target.value)}
                inputMode="url"
              />
              <label css={styles.fieldLabel} htmlFor="theme-generator-cloud-model">
                Model
              </label>
              <input
                id="theme-generator-cloud-model"
                css={styles.input}
                value={cloudModel}
                onChange={(event) => setCloudModel(event.target.value)}
              />
              <label css={styles.fieldLabel} htmlFor="theme-generator-api-key">
                API key
              </label>
              <input
                id="theme-generator-api-key"
                type="password"
                css={styles.input}
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                autoComplete="off"
              />
              <p css={styles.hint}>
                This key is held only for this editor session.
              </p>
                </Box>
              )}
            </details>
          )}

          <Box>
            <label css={styles.fieldLabel} htmlFor="theme-generator-prompt">
              Theme direction
            </label>
            <textarea
              id="theme-generator-prompt"
              css={styles.textarea}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder='e.g. "warm amber with violet accents, rounded, dark, professional"'
              rows={3}
            />
          </Box>

          {(isGenerating || candidate || status !== 'Describe a brand direction to create a reviewable theme draft.') && (
            <Box css={styles.status} role="status" aria-live="polite">
              {isGenerating && <span css={styles.dot} aria-hidden="true" />}
              {status}
            </Box>
          )}

          {previewScheme && (
            <Box css={styles.preview}>
              <Box css={styles.previewHeader}>
                <span css={styles.fieldLabel}>Draft · {candidate.mode}</span>
                <span css={candidate.source === 'fallback' ? styles.localChip : styles.ollamaChip}>
                  {THEME_PROVIDERS[candidate.source]?.label ?? 'Fallback'}
                </span>
              </Box>
              <Box css={styles.swatchRow}>
                {SWATCH_KEYS.map(({ key, label }) => (
                  <Box key={key} css={styles.swatchItem}>
                    <Box
                      css={styles.swatchColor}
                      style={{ backgroundColor: previewScheme[key] }}
                      aria-label={`${label}: ${previewScheme[key]}`}
                    />
                    <span css={styles.swatchLabel}>{label}</span>
                  </Box>
                ))}
              </Box>
              <Box css={styles.styleControls}>
                <Box css={styles.styleControl}>
                  <span css={styles.fieldLabel}>Corner shape</span>
                  <Box css={styles.styleOptionRow}>
                    {RADIUS_OPTIONS.map(([value, label]) => (
                      <button
                        type="button"
                        key={value}
                        css={candidate.theme.radius === value ? styles.styleOptionActive : styles.styleOption}
                        onClick={() => handleStyleChange({ radius: value })}
                      >
                        {label}
                      </button>
                    ))}
                  </Box>
                </Box>
                <Box css={styles.styleControl}>
                  <span css={styles.fieldLabel}>Typeface</span>
                  <Box css={styles.fontSelect}>
                    <StaticSelect
                      options={FONT_FAMILY_OPTIONS}
                      placeholder="Choose font"
                      value={candidate.theme.typography?.default?.fontFamily}
                      onSelect={(fontFamily) => handleStyleChange({ fontFamily })}
                    />
                  </Box>
                </Box>
                <Box css={styles.styleControl}>
                  <span css={styles.fieldLabel}>Message view</span>
                  <Box css={styles.styleOptionRow}>
                    {MESSAGE_VIEW_OPTIONS.map(({ value, label }) => (
                      <button
                        type="button"
                        key={value}
                        css={candidate.variants.messageView === value ? styles.styleOptionActive : styles.styleOption}
                        onClick={() => handleVariantChange('messageView', value)}
                      >
                        {label}
                      </button>
                    ))}
                  </Box>
                </Box>
                <Box css={styles.styleControl}>
                  <span css={styles.fieldLabel}>Display name</span>
                  <Box css={styles.styleOptionRow}>
                    {DISPLAY_NAME_OPTIONS.map(({ value, label }) => (
                      <button
                        type="button"
                        key={value}
                        css={candidate.variants.displayName === value ? styles.styleOptionActive : styles.styleOption}
                        onClick={() => handleVariantChange('displayName', value)}
                      >
                        {label}
                      </button>
                    ))}
                  </Box>
                </Box>
              </Box>
              <details css={styles.paletteEditor}>
                <summary>Customize palette</summary>
                <Box css={styles.paletteEditorHeader}>
                  <span css={styles.fieldLabel}>Editing tokens</span>
                  <Box css={styles.paletteModeToggle} role="group" aria-label="Palette mode">
                    {['light', 'dark'].map((nextMode) => (
                      <button
                        type="button"
                        key={nextMode}
                        css={paletteMode === nextMode ? styles.paletteModeActive : styles.paletteModeButton}
                        onClick={() => {
                          setPaletteMode(nextMode);
                          setVisiblePalettePicker(null);
                          endPaletteEdit();
                        }}
                      >
                        {nextMode}
                      </button>
                    ))}
                  </Box>
                </Box>
                <Box css={styles.paletteControls} ref={palettePickerRef}>
                  {PALETTE_GROUPS.map(({ label: groupLabel, tokens }) => (
                    <details key={groupLabel} css={styles.paletteGroup}>
                      <summary>{groupLabel}</summary>
                      <Box css={styles.paletteTokenGrid}>
                        {tokens.map(([token, label]) => {
                          const value = editableScheme[token];
                          const pickerId = `${paletteMode}-${token}`;
                          return (
                            <Box key={token} css={styles.paletteControl}>
                              <button
                                type="button"
                                css={styles.colorPickerTrigger}
                                style={{ backgroundColor: value }}
                                onClick={() => {
                                  beginPaletteEdit();
                                  setVisiblePalettePicker((visible) =>
                                    visible === pickerId ? null : pickerId
                                  );
                                }}
                                aria-label={`Choose ${label.toLowerCase()} color`}
                                aria-expanded={visiblePalettePicker === pickerId}
                              />
                              <span>{label}</span>
                              <code css={styles.colorCode}>{colorToHex(value) ?? value}</code>
                              {visiblePalettePicker === pickerId && (
                                <Box css={styles.colorPickerPopup}>
                                  <ColorPicker
                                    color={value}
                                    onChange={(updatedColor) =>
                                      handlePaletteChange(token, updatedColor.hex)
                                    }
                                  />
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    </details>
                  ))}
                </Box>
                <p css={styles.hint}>
                  Paired text colors are repaired automatically; unsafe changes are rejected.
                </p>
              </details>
            </Box>
          )}

          {candidate && (
            <Box css={styles.followUp}>
              <label css={styles.fieldLabel} htmlFor="theme-generator-follow-up">
                Refine this draft
              </label>
              <textarea
                id="theme-generator-follow-up"
                css={styles.followUpInput}
                value={followUp}
                onChange={(event) => setFollowUp(event.target.value)}
                placeholder='e.g. "Keep the colors, make it more rounded and use a serif font"'
                rows={2}
                disabled={isGenerating}
              />
              <Box css={styles.followUpActions}>
                <button
                  type="button"
                  css={styles.secondaryBtn}
                  onClick={handleFollowUp}
                  disabled={!followUp.trim() || isGenerating}
                >
                  Refine draft
                </button>
                {draftHistory.length > 0 && (
                  <button type="button" css={styles.textBtn} onClick={handleUndoDraft}>
                    Undo revision ({draftHistory.length})
                  </button>
                )}
              </Box>
              <p css={styles.hint}>
                Revisions retain the existing tokens unless you ask to change them.
              </p>
            </Box>
          )}

          <Box css={styles.btnRow}>
            {isGenerating ? (
              <button type="button" css={styles.secondaryBtn} onClick={handleCancel}>
                Cancel
              </button>
            ) : (
              <button
                type="button"
                css={styles.generateBtn}
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                {candidate ? 'Start new draft' : 'Generate draft'}
              </button>
            )}
            {candidate && !isGenerating && (
              <button type="button" css={styles.applyBtn} onClick={handleApply}>
                Apply draft
              </button>
            )}
          </Box>

          <Box css={styles.exportRow}>
            <button type="button" css={styles.textBtn} onClick={handleCopy}>
              Copy JSON
            </button>
            <button type="button" css={styles.textBtn} onClick={handleDownload}>
              Download JSON
            </button>
            {originalThemeRef.current && (
              <button type="button" css={styles.textBtn} onClick={handleReset}>
                Restore previous
              </button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AIThemePanel;
