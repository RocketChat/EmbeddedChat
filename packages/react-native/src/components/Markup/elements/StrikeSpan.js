import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import BoldSpan from './BoldSpan';
import ItalicSpan from './ItalicSpan';
import styles from '../styles';

const StrikeSpan = ({ value, style }) => (
  <Text style={[styles.del, style]}>
    {value.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} value={content.value} />;

        case 'ITALIC':
          return <ItalicSpan key={index} value={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} value={content.value} />;

        default:
          return null;
      }
    })}
  </Text>
);

export default StrikeSpan;

StrikeSpan.propTypes = {
  value: PropTypes.any,
};
