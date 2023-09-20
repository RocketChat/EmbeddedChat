import React from 'react';
import { Text } from 'react-native';
import styles from '../styles';

const PlainSpan = ({ value, style, ...otherProps }) => (
	<Text style={[styles.plainText, style]} {...otherProps}>
		{value}
	</Text>
);

export default PlainSpan;

