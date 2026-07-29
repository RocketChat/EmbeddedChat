import React from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { getAIComposerStyles } from './AIComposerToolbar.styles';

const AIComposerToolbar = ({ popup, actions, onAction }) => {
  const { theme } = useTheme();
  const styles = getAIComposerStyles(theme);

  if (!popup) return null;

  return (
    <Box
      css={[styles.wrapper, { left: popup.x, top: popup.y }]}
      role="toolbar"
      aria-label="Writing assistance"
      onMouseDown={(event) => event.preventDefault()}
    >
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          css={styles.actionButton}
          onClick={() => onAction(action.key)}
        >
          {action.label}
        </button>
      ))}
    </Box>
  );
};

AIComposerToolbar.propTypes = {
  popup: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAction: PropTypes.func.isRequired,
};

export default AIComposerToolbar;
