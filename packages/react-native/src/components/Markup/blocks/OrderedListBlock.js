import React from 'react';
import { View, FlatList, Text } from 'react-native';
import InlineElements from '../elements/InlineElements';
import styles from '../styles';

const OrderedListBlock = ({ value }) => (
  <View>
    <FlatList
      data={value}
      renderItem={({ item, index }) => {
        return (
          <View style={styles.listItem}>
            <Text>{index + 1}.</Text>
            <InlineElements value={item.value} />
          </View>
        );
      }}
    />
  </View>
);

export default OrderedListBlock;
