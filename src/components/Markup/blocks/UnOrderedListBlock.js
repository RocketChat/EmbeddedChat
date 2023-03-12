import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const UnOrderedListBlock = ({ items, classes }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>
        <InlineElements contents={item.value} classes={classes} />
      </li>
    ))}
  </ul>
);

export default UnOrderedListBlock;

UnOrderedListBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
  classes: PropTypes.object,
};
