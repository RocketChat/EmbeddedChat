import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';
import { listStyles } from './blocks.styles';

const UnOrderedListBlock = ({ items }) => (
  <ul css={listStyles}>
    {items.map((item, index) => (
      <li key={index}>
        <InlineElements contents={item.value} />
      </li>
    ))}
  </ul>
);

export default UnOrderedListBlock;

UnOrderedListBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
};
