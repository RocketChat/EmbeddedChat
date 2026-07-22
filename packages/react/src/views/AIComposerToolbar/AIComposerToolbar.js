import React from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { getAIComposerStyles } from './AIComposerToolbar.styles';

const ACTION_LABELS = {
  grammar: 'grammar',
  spelling: 'spelling',
  rephrase: 'rephrasing',
  match_tone: 'tone matching',
  formal: 'formalization',
  casual: 'casual rewrite',
  shorten: 'shortening',
  expand: 'expanding',
  emojify: 'emojification',
  translate: 'translation',
};

const AIComposerToolbar = ({
  showToolbar,
  suggestion,
  isProcessing,
  activeAction,
  actions,
  onAction,
  onAccept,
  onReject,
}) => {
  const { theme } = useTheme();
  const styles = getAIComposerStyles(theme);

  if (!showToolbar && !isProcessing && !suggestion) return null;

  const group1 = actions.filter((a) => a.group === 1);
  const group2 = actions.filter((a) => a.group === 2);

  return (
    <Box css={styles.wrapper}>
      {/* ── Floating Action Toolbar ── */}
      {showToolbar && !isProcessing && !suggestion && (
        <Box
          css={styles.toolbar}
          role="toolbar"
          aria-label="AI writing actions"
        >
          <span css={styles.toolbarLabel}>✦ AI</span>

          {/* Row 1 */}
          <Box css={styles.actionRow}>
            {group1.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                css={styles.actionBtn}
                onClick={() => onAction(key)}
                aria-label={label}
              >
                {label}
              </button>
            ))}
          </Box>

          <span css={styles.divider} />

          {/* Row 2 */}
          <Box css={styles.actionRow}>
            {group2.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                css={styles.actionBtn}
                onClick={() => onAction(key)}
                aria-label={label}
              >
                {label}
              </button>
            ))}
          </Box>
        </Box>
      )}

      {/* ── Processing indicator ── */}
      {isProcessing && (
        <Box css={styles.processingRow} role="status" aria-live="polite">
          <span css={styles.processingDot} />
          <span
            css={styles.processingDot}
            style={{ animationDelay: '0.15s' }}
          />
          <span css={styles.processingDot} style={{ animationDelay: '0.3s' }} />
          <span>
            AI is applying{' '}
            {activeAction
              ? ACTION_LABELS[activeAction] ?? activeAction
              : 'changes'}
            …
          </span>
        </Box>
      )}

      {/* ── Suggestion preview ── */}
      {suggestion && !isProcessing && (
        <Box css={styles.suggestionBox}>
          <Box css={styles.suggestionHeader}>
            <span css={styles.suggestionLabel}>
              ✦ AI · {ACTION_LABELS[suggestion.actionKey] ?? 'suggestion'}
            </span>
            <Box css={styles.suggestionActions}>
              <button
                type="button"
                css={styles.rejectBtn}
                onClick={onReject}
                aria-label="Reject suggestion"
              >
                ✕ Reject
              </button>
              <button
                type="button"
                css={styles.acceptBtn}
                onClick={onAccept}
                aria-label="Accept suggestion"
              >
                ✓ Accept
              </button>
            </Box>
          </Box>
          <p css={styles.suggestionText}>{suggestion.text}</p>
          <p css={styles.originalLabel}>
            Original: &ldquo;{suggestion.original}&rdquo;
          </p>
        </Box>
      )}
    </Box>
  );
};

export default AIComposerToolbar;
