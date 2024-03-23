import PropTypes from 'prop-types';
import React from 'react';
import { css } from '@emotion/react';
import InlineElements from '../elements/InlineElements';

const ParagraphBlockCss = css`
  margin: 0;
`;

const ParagraphBlock = ({ contents }) => (
  <p css={ParagraphBlockCss}>
    <InlineElements contents={contents} />
  </p>
);

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
};
