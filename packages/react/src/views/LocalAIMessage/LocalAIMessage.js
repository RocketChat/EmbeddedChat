import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  ActionButton,
  Box,
  Icon,
  Tooltip,
  useTheme,
} from '@embeddedchat/ui-elements';

const LocalAIMessage = ({ catchUp, onDismiss }) => {
  const { theme } = useTheme();

  return (
    <Box
      className="ec-local-ai-message"
      css={css`
        display: flex;
        gap: 0.7rem;
        margin: 0.5rem 2rem 1rem;
        padding: 0.7rem 0.8rem;
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.radius};
        background: ${theme.colors.card};

        @media (max-width: 500px) {
          margin: 0;
          border-radius: 0;
        }
      `}
    >
      <Box
        aria-hidden="true"
        css={css`
          width: 2rem;
          height: 2rem;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 50%;
          color: ${theme.colors.primary};
          background: ${theme.colors.muted};
        `}
      >
        <Icon name="summarize" size="1rem" />
      </Box>
      <Box
        css={css`
          min-width: 0;
          flex: 1;
        `}
      >
        <Box
          css={css`
            display: flex;
            align-items: baseline;
            gap: 0.45rem;
            margin-bottom: 0.25rem;
          `}
        >
          <strong>Catch up</strong>
          <span
            css={css`
              color: ${theme.colors.mutedForeground};
              font-size: 0.72rem;
            `}
          >
            You only
          </span>
          <span
            css={css`
              color: ${theme.colors.mutedForeground};
              font-size: 0.72rem;
            `}
          >
            {new Intl.DateTimeFormat(undefined, {
              hour: 'numeric',
              minute: '2-digit',
            }).format(new Date(catchUp.createdAt))}
          </span>
        </Box>
        <Box
          css={css`
            white-space: pre-wrap;
            line-height: 1.5;
            font-size: 0.9rem;
          `}
        >
          {catchUp.text}
        </Box>
      </Box>
      <Tooltip text="Dismiss catch up" position="top">
        <ActionButton
          ghost
          square
          size="small"
          icon="cross"
          aria-label="Dismiss catch up"
          onClick={() => onDismiss(catchUp.id)}
        />
      </Tooltip>
    </Box>
  );
};

LocalAIMessage.propTypes = {
  catchUp: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default LocalAIMessage;
