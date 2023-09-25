import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ParagraphBlock from './ParagraphBlock';
import { useTheme } from '@emotion/react';
import styles from '../styles';
import { colors } from '../../../lib/constants';

const QuoteBlock = ({ value }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
			<View style={[styles.quote, { backgroundColor: colors[theme.palette.mode].borderColor }]} />
			<View style={styles.childContainer}>
				{value.map((item, index) => (
					<ParagraphBlock key={index} value={item.value} />
				))}
			</View>
		</View>
  )
};

export default QuoteBlock;

QuoteBlock.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape),
};
