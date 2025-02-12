// import colors from '@rocket.chat/fuselage-tokens/colors.json';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';

// const Fallback = styled('span')`
// 	text-decoration: underline;
// 	text-decoration-color: ${colors.r400};
// `;

const KatexErrorBoundary = ({ children, code }) => {
  const [error, setError] = useState(null);
  return (
    <ErrorBoundary
      //   children={children}
      onError={setError}
      fallback={
        <Box
          is="span"
          title={error?.message}
          css={css`
            text-decoration: underline;
            text-decoration-color: red;
          `}
        >
          <span>{code}</span>
        </Box>
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
