import React from 'react';
import { View } from 'react-native';
import PlainSpan from '../elements/PlainSpan';
import styles from '../styles';

const HeadingBlock = ({ value, level = 1 }) => {
  const textStyle = styles[`heading${level}`];
  return (
    <View>
      {value.map((value, index) => (
        <PlainSpan key={index} value={value.value} style={textStyle}/>
      ))}
    </View>
  );
};

export default HeadingBlock;
