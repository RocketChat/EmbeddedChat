import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import BoldSpan from './BoldSpan';
import ItalicSpan from './ItalicSpan';
import CodeElement from './CodeElement';
import Emoji from './Emoji';
import ChannelMention from '../mentions/ChannelMention';
import UserMention from '../mentions/UserMention';
import TimestampElement from './TimestampElement';

const StrikeSpan = ({ contents }) => (
  <del>
    {contents.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} contents={content.value} />;

        case 'ITALIC':
          return <ItalicSpan key={index} contents={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} contents={content.value} />;

        case 'INLINE_CODE':
          return <CodeElement key={index} contents={content.value} />;

        case 'EMOJI':
          return <Emoji key={index} emoji={content} />;

        case 'MENTION_CHANNEL':
          return <ChannelMention key={index} mention={content.value.value} />;

        case 'MENTION_USER':
          return <UserMention key={index} contents={content.value} />;

        case 'TIMESTAMP':
          return <TimestampElement key={index} contents={content.value} />;

        default:
          return null;
      }
    })}
  </del>
);

export default StrikeSpan;

StrikeSpan.propTypes = {
  contents: PropTypes.any,
};
