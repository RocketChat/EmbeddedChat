import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const UnOrderedListBlock = ({ items }) => (
  <ul>
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
