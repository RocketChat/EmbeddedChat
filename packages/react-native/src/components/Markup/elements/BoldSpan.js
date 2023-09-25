import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import ItalicSpan from './ItalicSpan';
import StrikeSpan from './StrikeSpan';
import styles from '../styles';

const BoldSpan = ({ value, style }) => (
  <Text style={[styles.strong, style]}>
    {value.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} value={content.value} />;

        case 'STRIKE':
          return <StrikeSpan key={index} value={content.value} />;

        case 'ITALIC':
          return <ItalicSpan key={index} value={content.value} />;

        default:
          return null;
      }
    })}
  </Text>
);

export default BoldSpan;

BoldSpan.propTypes = {
  value: PropTypes.any,
};
