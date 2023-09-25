import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';
import React from 'react';
import InlineElements from '../elements/InlineElements';
import styles from '../styles';

const UnOrderedListBlock = ({ value }) => (
  <View>
    <FlatList
      data={value}
      renderItem={({ item }) => {
        return (
          <View style={styles.listItem}>
            <Text style={{fontWeight: 600}}>{`\u2022`}</Text>
            <InlineElements value={item.value} />
          </View>
        );
      }}
    />
  </View>
);

export default UnOrderedListBlock;

UnOrderedListBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape),
};
