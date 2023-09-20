import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from "react-native"
import { colors } from '../../../lib/constants';

import InlineElements from '../elements/InlineElements';
import styles from "../styles"

const ParagraphBlock = ({ value }) => {
  const theme = useTheme();
  return (
    <View style={[styles.text, styles.paragraph, { color: colors[theme.palette.mode].bodyText }]}>
      <InlineElements value={value} />
    </View>
  );
}

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  value: PropTypes.any,
};
