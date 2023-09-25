import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import styles from '../styles';

const CodeElement = ({ value }) => (
  <View style={[styles.codeInline]}>
    <PlainSpan value={value.value} />
  </View>
);

export default CodeElement;

CodeElement.propTypes = {
  value: PropTypes.any,
};
