import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  useTheme,
  useToastBarDispatch,
  Icon,
} from '@embeddedchat/ui-elements';
import {
  GeneratedUiContent,
  createGeneratedUiConfiguration,
  GENERATED_UI_PLACEMENTS,
} from '@embeddedchat/ui-kit';
import {
  OllamaAdapter,
  OpenAIAdapter,
  MockAdapter,
} from '@embeddedchat/ai-adapter';
import { getAICodePanelStyles } from './AICodePanel.styles';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useAiGeneratedBlocksStore from '../../store/aiGeneratedBlocksStore';
import { useGeneratedUiExport } from './useGeneratedUiExport';
import GeneratedUiActions from './GeneratedUiActions';

const AICodePanel = () => {
  const { theme } = useTheme();
  const styles = getAICodePanelStyles(theme);
  const dispatchToastMessage = useToastBarDispatch();

  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState(() => {
    const savedProvider = localStorage.getItem('ec_ai_provider');
    return ['mock', 'ollama', 'openai'].includes(savedProvider)
      ? savedProvider
      : 'mock';
  });

  // Ollama states
  const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
  const [modelName, setModelName] = useState('qwen2.5:3b');

  // OpenAI states
  const [openAIKey, setOpenAIKey] = useState(
    () => localStorage.getItem('ec_openai_key') || ''
  );
  const [openAIModel, setOpenAIModel] = useState(
    () => localStorage.getItem('ec_openai_model') || 'gpt-4o'
  );
  const [openAIBaseUrl, setOpenAIBaseUrl] = useState(
    'https://api.openai.com/v1'
  );

  // Generation & Layout states
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftBlocks, setDraftBlocks] = useState([]);
  const [draftComponentType, setDraftComponentType] = useState('info');
  const [componentId, setComponentId] = useState(
    () => localStorage.getItem('ec_draft_component_id') || 'generated-ui'
  );
  const [componentTitle, setComponentTitle] = useState(
    () => localStorage.getItem('ec_draft_component_title') || 'Generated UI'
  );
  const [errorMsg, setErrorMsg] = useState(null);
  const [tab, setTab] = useState('preview');
  const [surface, setSurface] = useState('message');
  const [placements, setPlacements] = useState(['composer']);

  const publishConfiguration = useAiGeneratedBlocksStore(
    (state) => state.publishConfiguration
  );

  // Load draft from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ec_draft_blocks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        createGeneratedUiConfiguration({ blocks: parsed });
        setDraftBlocks(parsed);
      } catch (e) {
        setErrorMsg(
          'The saved draft is invalid. Reset it or generate a new component.'
        );
      }
    }
    const savedType = localStorage.getItem('ec_draft_component_type');
    if (savedType) {
      setDraftComponentType(savedType);
    }
    const savedPlacements = localStorage.getItem('ec_draft_placements');
    if (savedPlacements) {
      try {
        const parsedPlacements = JSON.parse(savedPlacements);
        const validPlacements = Array.isArray(parsedPlacements)
          ? Array.from(
              new Set(
                parsedPlacements.filter((placement) =>
                  GENERATED_UI_PLACEMENTS.includes(placement)
                )
              )
            )
          : [];
        if (validPlacements.length > 0) {
          setPlacements(validPlacements);
        }
      } catch (e) {
        console.error('Failed to parse saved generated UI placements', e);
      }
    }
  }, []);

  const {
    configuration,
    exportError,
    getGeneratedUiConfiguration,
    isDevMode,
    toggleDevMode,
    isSyncingPreview,
    handleSyncToEmbeddedChat,
    handleCopyGeneratedUiConfiguration,
    handleDownloadGeneratedUiConfiguration,
  } = useGeneratedUiExport({
    componentId,
    componentTitle,
    draftBlocks,
    surface,
    draftComponentType,
    placements,
    dispatchToastMessage,
  });

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    if (provider === 'openai' && !openAIKey.trim()) {
      dispatchToastMessage({
        type: 'error',
        message: 'OpenAI API Key is required.',
      });
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      let adapter;
      if (provider === 'ollama') {
        adapter = new OllamaAdapter({
          baseUrl,
          model: modelName,
        });
      } else if (provider === 'openai') {
        adapter = new OpenAIAdapter({
          apiKey: openAIKey,
          model: openAIModel,
          baseUrl: openAIBaseUrl || undefined,
        });
      } else {
        adapter = new MockAdapter();
      }

      const { blocks: updatedBlocks, componentType: updatedType } =
        await adapter.generateUIBlocks(prompt, draftBlocks);
      setDraftBlocks(updatedBlocks);
      setDraftComponentType(updatedType);
      localStorage.setItem('ec_draft_blocks', JSON.stringify(updatedBlocks));
      localStorage.setItem('ec_draft_component_type', updatedType);
      setPrompt('');

      dispatchToastMessage({
        type: 'success',
        message: 'UI Blocks updated successfully!',
      });
    } catch (e) {
      console.error('[AI Code Panel]', e);
      setErrorMsg(e.message || String(e));
      dispatchToastMessage({
        type: 'error',
        message: `Generation failed: ${e.message || String(e)}`,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    prompt,
    provider,
    baseUrl,
    modelName,
    openAIKey,
    openAIModel,
    openAIBaseUrl,
    draftBlocks,
    isGenerating,
    dispatchToastMessage,
  ]);

  const handlePublish = useCallback(() => {
    try {
      publishConfiguration(getGeneratedUiConfiguration());
      dispatchToastMessage({
        type: 'success',
        message: 'Component applied to the editor preview.',
      });
    } catch (error) {
      dispatchToastMessage({ type: 'error', message: error.message });
    }
  }, [publishConfiguration, getGeneratedUiConfiguration, dispatchToastMessage]);

  const togglePlacement = useCallback((placement) => {
    setPlacements((currentPlacements) => {
      const isSelected = currentPlacements.includes(placement);
      const nextPlacements = isSelected
        ? currentPlacements.length === 1
          ? currentPlacements
          : currentPlacements.filter(
              (currentPlacement) => currentPlacement !== placement
            )
        : [...currentPlacements, placement];

      localStorage.setItem(
        'ec_draft_placements',
        JSON.stringify(nextPlacements)
      );
      return nextPlacements;
    });
  }, []);

  const handleReset = useCallback(() => {
    setDraftBlocks([]);
    setDraftComponentType('info');
    setErrorMsg(null);
    localStorage.removeItem('ec_draft_blocks');
    localStorage.removeItem('ec_draft_component_type');
    localStorage.removeItem('ec_draft_placements');
    localStorage.removeItem('ec_draft_component_id');
    localStorage.removeItem('ec_draft_component_title');
    setComponentId('generated-ui');
    setComponentTitle('Generated UI');
    setPlacements(['composer']);
    dispatchToastMessage({
      type: 'success',
      message: 'Draft blocks cleared.',
    });
  }, [dispatchToastMessage]);

  const handleCopyJSON = useCallback(() => {
    const jsonStr = JSON.stringify(draftBlocks, null, 2);
    navigator.clipboard
      .writeText(jsonStr)
      .then(() => {
        dispatchToastMessage({
          type: 'success',
          message: 'JSON blocks copied to clipboard.',
        });
      })
      .catch((err) => {
        console.error('Copy failed', err);
        dispatchToastMessage({
          type: 'error',
          message: 'Failed to copy JSON blocks.',
        });
      });
  }, [draftBlocks, dispatchToastMessage]);

  return (
    <Box css={styles.panel}>
      {/* Header */}
      <Box
        css={styles.header}
        onClick={() => setOpen((o) => !o)}
        is="button"
        type="button"
        aria-expanded={open}
      >
        <Box css={styles.headerTitle}>
          <span>✦</span>
          <span>AI Component Generator</span>
          <span css={styles.badge}>UI-Kit</span>
        </Box>
        <span>{open ? '▲' : '▼'}</span>
      </Box>

      {/* Body */}
      {open && (
        <Box css={styles.body}>
          {/* AI Provider selector */}
          <Box>
            <span css={styles.fieldLabel}>AI Provider</span>
            <select
              css={styles.input}
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                localStorage.setItem('ec_ai_provider', e.target.value);
              }}
            >
              <option value="mock">Demo (Mock)</option>
              <option value="ollama">Local (Ollama)</option>
              <option value="openai">Cloud (OpenAI)</option>
            </select>
          </Box>

          {provider === 'ollama' && (
            <>
              <Box>
                <span css={styles.fieldLabel}>Ollama URL</span>
                <input
                  css={styles.input}
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                />
              </Box>
              <Box>
                <span css={styles.fieldLabel}>Model</span>
                <input
                  css={styles.input}
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="qwen2.5:3b"
                />
              </Box>
            </>
          )}

          {provider === 'openai' && (
            <>
              <Box>
                <span css={styles.fieldLabel}>OpenAI API Key</span>
                <input
                  type="password"
                  css={styles.input}
                  value={openAIKey}
                  onChange={(e) => {
                    setOpenAIKey(e.target.value);
                    localStorage.setItem('ec_openai_key', e.target.value);
                  }}
                  placeholder="sk-..."
                  aria-label="OpenAI API Key"
                />
              </Box>
              <Box>
                <span css={styles.fieldLabel}>OpenAI Model</span>
                <input
                  css={styles.input}
                  value={openAIModel}
                  onChange={(e) => {
                    setOpenAIModel(e.target.value);
                    localStorage.setItem('ec_openai_model', e.target.value);
                  }}
                  placeholder="gpt-4o"
                  aria-label="OpenAI Model"
                />
              </Box>
              <Box>
                <span css={styles.fieldLabel}>OpenAI Base URL</span>
                <input
                  css={styles.input}
                  value={openAIBaseUrl}
                  onChange={(e) => setOpenAIBaseUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  aria-label="OpenAI Base URL"
                />
              </Box>
            </>
          )}

          {/* Prompt */}
          <Box>
            <span css={styles.fieldLabel}>Describe UI Component / Changes</span>
            <textarea
              css={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "Create a login form with username, password and a sign-in button"'
              rows={3}
            />
          </Box>

          <Box>
            <span css={styles.fieldLabel}>Component ID</span>
            <input
              css={styles.input}
              value={componentId}
              onChange={(e) => {
                setComponentId(e.target.value);
                localStorage.setItem('ec_draft_component_id', e.target.value);
              }}
              placeholder="generated-ui"
              aria-label="Generated UI component ID"
            />
          </Box>

          <Box>
            <span css={styles.fieldLabel}>Component title</span>
            <input
              css={styles.input}
              value={componentTitle}
              onChange={(e) => {
                setComponentTitle(e.target.value);
                localStorage.setItem(
                  'ec_draft_component_title',
                  e.target.value
                );
              }}
              placeholder="Generated UI"
              aria-label="Generated UI component title"
            />
          </Box>

          {/* Processing indicator */}
          {isGenerating && (
            <Box css={styles.processingRow}>
              <span css={styles.dot} />
              <span css={styles.dot} style={{ animationDelay: '0.15s' }} />
              <span css={styles.dot} style={{ animationDelay: '0.3s' }} />
              <span>Generating UI Layout…</span>
            </Box>
          )}

          <button
            type="button"
            css={styles.generateBtn}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? 'Generating…' : '✦ Generate Component'}
          </button>

          {/* Inline Error State */}
          {errorMsg && (
            <div
              style={{
                color: '#ef4444',
                padding: '0.75rem',
                fontSize: '0.75rem',
                border: '1px solid #fee2e2',
                borderRadius: '4px',
                backgroundColor: '#fef2f2',
                marginTop: '0.5rem',
              }}
            >
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          {/* Preview / Code Tab Section */}
          {draftBlocks && draftBlocks.length > 0 && !errorMsg && (
            <>
              <Box css={styles.tabRow}>
                <button
                  type="button"
                  css={[
                    styles.tabBtn,
                    tab === 'preview' && styles.tabBtnActive,
                  ]}
                  onClick={() => setTab('preview')}
                >
                  Preview
                </button>
                <button
                  type="button"
                  css={[styles.tabBtn, tab === 'code' && styles.tabBtnActive]}
                  onClick={() => setTab('code')}
                >
                  JSON Blocks
                </button>
              </Box>

              {tab === 'preview' ? (
                <>
                  {/* Target Surface selector */}
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '0.4rem 0.5rem',
                      background: 'rgba(0,0,0,0.04)',
                      borderLeft: '1px solid',
                      borderRight: '1px solid',
                      borderColor: 'var(--ec-border, #e0e0e0)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#888',
                      }}
                    >
                      Surface:
                    </span>
                    <Box
                      style={{
                        display: 'flex',
                        gap: '0.35rem',
                        justifyContent: 'space-between',
                      }}
                    >
                      {[
                        ['message', 'Message'],
                        ['contextualBar', 'Contextual Bar'],
                        ['modal', 'Modal'],
                      ].map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSurface(val)}
                          style={{
                            flex: 1,
                            fontSize: '0.7rem',
                            padding: '0.3rem 0.15rem',
                            borderRadius: '0.2rem',
                            border: '1px solid',
                            borderColor:
                              surface === val ? '#6366f1' : '#d1d5db',
                            background:
                              surface === val ? '#6366f1' : 'transparent',
                            color: surface === val ? '#fff' : 'inherit',
                            cursor: 'pointer',
                            fontWeight: surface === val ? 700 : 400,
                            transition: 'all 0.15s',
                            whiteSpace: 'normal',
                            minWidth: '0',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </Box>
                  </Box>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '0.4rem 0.5rem',
                      background: 'rgba(0,0,0,0.04)',
                      border: '1px solid',
                      borderColor: 'var(--ec-border, #e0e0e0)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#888',
                      }}
                    >
                      Open from:
                    </span>
                    <Box style={{ display: 'flex', gap: '0.35rem' }}>
                      {[
                        ['composer', 'Composer'],
                        ['messageToolbox', 'Message toolbox'],
                      ].map(([placement, label]) => (
                        <button
                          key={placement}
                          type="button"
                          onClick={() => togglePlacement(placement)}
                          style={{
                            flex: 1,
                            fontSize: '0.7rem',
                            padding: '0.3rem 0.15rem',
                            borderRadius: '0.2rem',
                            border: '1px solid',
                            borderColor: placements.includes(placement)
                              ? '#6366f1'
                              : '#d1d5db',
                            background: placements.includes(placement)
                              ? '#6366f1'
                              : 'transparent',
                            color: placements.includes(placement)
                              ? '#fff'
                              : 'inherit',
                            cursor: 'pointer',
                            fontWeight: placements.includes(placement)
                              ? 700
                              : 400,
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </Box>
                  </Box>
                  <Box
                    css={styles.previewBox}
                    style={{ display: 'block', minHeight: 'auto' }}
                  >
                    {configuration ? (
                      <GeneratedUiContent
                        configuration={configuration}
                        placement="editor"
                      />
                    ) : (
                      <Box role="alert">{exportError}</Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box css={styles.codeWrapper}>
                  <Box css={styles.codeHeader}>
                    <span>UI-KIT BLOCK SCHEMA JSON</span>
                    <button
                      type="button"
                      css={styles.copyIconBtn}
                      onClick={handleCopyJSON}
                      title="Copy JSON"
                    >
                      <Icon name="copy" size="1rem" />
                    </button>
                  </Box>
                  <SyntaxHighlighter
                    language="json"
                    style={dracula}
                    css={styles.syntaxBox}
                  >
                    {JSON.stringify(draftBlocks, null, 2)}
                  </SyntaxHighlighter>
                </Box>
              )}

              <GeneratedUiActions
                styles={styles}
                disabled={Boolean(exportError)}
                onApply={handlePublish}
                onCopy={handleCopyGeneratedUiConfiguration}
                onDownload={handleDownloadGeneratedUiConfiguration}
                onReset={handleReset}
              />
              {import.meta.env.DEV && (
                <Box css={styles.devModeControl}>
                  <Box>
                    <span css={styles.devModeTitle}>Dev mode</span>
                    <p css={styles.devModeHint}>
                      Show the local EmbeddedChat preview sync action.
                    </p>
                  </Box>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isDevMode}
                    aria-label="Enable developer mode"
                    css={[
                      styles.devModeSwitch,
                      isDevMode && styles.devModeSwitchActive,
                    ]}
                    onClick={toggleDevMode}
                  >
                    <span
                      css={[
                        styles.devModeThumb,
                        isDevMode && styles.devModeThumbActive,
                      ]}
                    />
                  </button>
                </Box>
              )}
              {import.meta.env.DEV && isDevMode && (
                <button
                  type="button"
                  css={[
                    styles.actionButton,
                    styles.secondaryAction,
                    styles.syncAction,
                  ]}
                  onClick={handleSyncToEmbeddedChat}
                  disabled={isSyncingPreview || Boolean(exportError)}
                >
                  {isSyncingPreview
                    ? 'Syncing EmbeddedChat preview…'
                    : 'Sync to EmbeddedChat preview'}
                </button>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

AICodePanel.displayName = 'AICodePanel';

export default AICodePanel;
