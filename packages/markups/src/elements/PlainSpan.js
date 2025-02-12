import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { useTheme } from '@embeddedchat/ui-elements';

const PlainSpan = ({ contents }) => {
  const { theme } = useTheme();
  if (contents === '>') {
    return (
      <blockquote
        css={css`
          background-color: ${theme.colors.secondary};
          border-left: 1.7px solid ${theme.colors.primary};
          padding-left: 0.5rem;
        `}
      >
        &nbsp;
      </blockquote>
    );
  }
  return <>{contents}</>;
};
export default PlainSpan;

PlainSpan.propTypes = {
  contents: PropTypes.string,
};
