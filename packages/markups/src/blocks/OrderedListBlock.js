import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';
import { listStyles } from './blocks.styles';

const OrderedListBlock = ({ items }) => (
  <ol css={listStyles}>
    {items.map((item, index) => (
      <li key={index} value={item.number}>
        <InlineElements contents={item.value} />
      </li>
    ))}
  </ol>
);

export default OrderedListBlock;

OrderedListBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
};
