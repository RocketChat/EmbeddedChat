import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import BoldSpan from './BoldSpan';
import StrikeSpan from './StrikeSpan';
import styles from '../styles';

const ItalicSpan = ({ value, style}) => (
  <Text style={[styles.emph, style]}>
    {value.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} value={content.value} />;

        case 'STRIKE':
          return <StrikeSpan key={index} value={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} value={content.value} />;

        default:
          return null;
      }
    })}
  </Text>
);

export default ItalicSpan;

ItalicSpan.propTypes = {
  value: PropTypes.any,
};
