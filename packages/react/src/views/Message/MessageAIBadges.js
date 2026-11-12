import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';

const CATEGORY_COLORS = {
  question: '#6366f1',
  greeting: '#22c55e',
  request: '#f59e0b',
  statement: '#64748b',
  other: '#94a3b8',
};

const SENTIMENT_COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#94a3b8',
};

const badgeStyle = (bg) => css`
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: ${bg};
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

// Simple in-memory cache so we don't re-call the API for the same message
const badgeCache = new Map();

// Only process messages sent in the last 60 seconds to avoid hammering the API
const isRecent = (ts) => {
  const msgTime = new Date(ts).getTime();
  return Date.now() - msgTime < 60000;
};

const MessageAIBadges = ({ message }) => {
  const { ECOptions } = useContext(RCContext);
  const adapter = ECOptions?.aiAdapter ?? null;
  const [badges, setBadges] = useState(
    () => badgeCache.get(message._id) || null
  );

  useEffect(() => {
    if (!adapter || !message.msg || message.t) return;
    // Skip old messages — only classify recent ones
    if (!isRecent(message.ts)) return;
    // Already cached
    if (badgeCache.has(message._id)) {
      setBadges(badgeCache.get(message._id));
      return;
    }

    let cancelled = false;

    adapter
      .processMessage(message.msg)
      .then((result) => {
        if (!cancelled) {
          badgeCache.set(message._id, result);
          setBadges(result);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [adapter, message._id, message.msg, message.t, message.ts]);

  if (!badges) return null;

  return (
    <Box
      css={css`
        display: flex;
        gap: 0.3rem;
        margin-top: 0.2rem;
      `}
    >
      <span css={badgeStyle(CATEGORY_COLORS[badges.category] || '#94a3b8')}>
        {badges.category}
      </span>
      <span css={badgeStyle(SENTIMENT_COLORS[badges.sentiment] || '#94a3b8')}>
        {badges.sentiment}
      </span>
    </Box>
  );
};

MessageAIBadges.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageAIBadges;
