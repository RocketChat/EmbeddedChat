import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import StrikeSpan from './StrikeSpan';
import ItalicSpan from './ItalicSpan';
import BoldSpan from './BoldSpan';
import { openLink } from '../../../lib/openLink';
import styles from '../styles';

const LinkSpan = ({ href, label }) => {
  const value = React.useMemo(() => {
    const labelArray = Array.isArray(label) ? label : [label];

    const labelElements = labelArray.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} value={content.value} style={styles.link}/>;

        case 'STRIKE':
          return <StrikeSpan key={index} value={content.value} style={styles.link}/>;

        case 'ITALIC':
          return <ItalicSpan key={index} value={content.value} style={styles.link}/>;

        case 'BOLD':
          return <BoldSpan key={index} value={content.value} style={styles.link}/>;

        default:
          return null;
      }
    });

    return labelElements;
  }, [label]);

  return (
    <Text onPress={() => openLink(href)} style={styles.link}>
      {value}
    </Text>
  );
};

export default LinkSpan;

LinkSpan.propTypes = {
  href: PropTypes.string,
  label: PropTypes.string,
};
