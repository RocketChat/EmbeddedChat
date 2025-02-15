import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { Box, Tooltip, useTheme } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';

const KatexErrorBoundary = ({ children, code }) => {
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  return (
    <ErrorBoundary
      onError={setError}
      fallback={
        <Tooltip
          text={error?.message}
          position="top"
        >
          <Box
            is="span"
            css={css`
              text-decoration: underline;
              text-decoration-color: ${theme.colors.destructive};
            `}
          >
            <span>{code}</span>
          </Box>
        </Tooltip>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default KatexErrorBoundary;
KatexErrorBoundary.propTypes = {
  code: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
