import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { useRCContext } from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';

const getStyles = (theme) => ({
  bar: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.4rem 2rem;
    border-top: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    align-items: center;
    min-height: 2.5rem;
  `,
  label: css`
    font-size: 0.7rem;
    font-weight: 600;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-right: 0.25rem;
    white-space: nowrap;
  `,
  chip: css`
    font-size: 0.8rem;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.secondary};
    color: ${theme.colors.foreground};
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
    &:hover {
      background: ${theme.colors.accent};
      border-color: ${theme.colors.ring};
    }
  `,
  badge: css`
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    margin-left: auto;
    white-space: nowrap;
  `,
});

/**
 * SmartReplies — renders AI-powered quick-reply chips above the chat input.
 *
 * Reads `aiAdapter` from ECOptions (via RCContext) — the same context that
 * carries `host`, `roomId`, etc. No separate provider wrapper is needed.
 *
 * Activated automatically when the consumer passes `aiAdapter` to <EmbeddedChat>:
 *
 *   import { OpenAIAdapter } from '@embeddedchat/ai-adapter';
 *   const adapter = new OpenAIAdapter({ apiKey: 'sk-...' });
 *   <EmbeddedChat host="..." roomId="..." aiAdapter={adapter} />
 *
 * @param {{ onSelect: (text: string) => void }} props
 */
const SmartReplies = ({ onSelect }) => {
  const { ECOptions } = useRCContext();
  const adapter = ECOptions?.aiAdapter ?? null;

  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const messages = useMessageStore((state) => state.messages);
  const username = useUserStore((state) => state.username);

  const fetchSuggestions = useCallback(async () => {
    if (!adapter || messages.length === 0) return;

    setLoading(true);
    try {
      const results = await adapter.getSmartReplies({
        recentMessages: messages.slice(-5).map((m) => ({
          _id: m._id,
          msg: m.msg ?? '',
          u: { _id: m.u._id, username: m.u.username, name: m.u.name },
          ts: m.ts,
        })),
        currentUsername: username ?? '',
      });
      setSuggestions(results);
    } catch (err) {
      console.error('[SmartReplies] fetch failed:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [adapter, messages, username]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Render nothing when no adapter is configured or no suggestions yet
  if (!adapter || (suggestions.length === 0 && !loading)) return null;

  return (
    <Box css={styles.bar}>
      <span css={styles.label}>Suggestions</span>
      {loading ? (
        <span css={styles.label}>…</span>
      ) : (
        suggestions.map((s) => (
          <button
            key={s.id}
            css={styles.chip}
            type="button"
            onClick={() => onSelect(s.text)}
            title={`Confidence: ${Math.round(s.confidence * 100)}%`}
          >
            {s.text}
          </button>
        ))
      )}
      <span css={styles.badge}>{adapter.providerName}</span>
    </Box>
  );
};

SmartReplies.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default SmartReplies;
