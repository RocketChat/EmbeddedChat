import React from 'react';
import PlainSpan from './PlainSpan';
import ItalicSpan from './ItalicSpan';
import StrikeSpan from './StrikeSpan';
import BoldSpan from './BoldSpan';
import CodeElement from './CodeElement';
import Emoji from './Emoji';
import ChannelMention from '../mentions/ChannelMention';
import ColorElement from './ColorElement';
import LinkSpan from './LinkSpan';
import Mention from './Mention';

const InlineElements = ({ value }) =>
  value.map((content, index) => {
    switch (content.type) {
      case 'BOLD':
        return <BoldSpan key={index} value={content.value} />;

      case 'PLAIN_TEXT':
        return <PlainSpan key={index} value={content.value} />;

      case 'STRIKE':
        return <StrikeSpan key={index} value={content.value} />;

      case 'ITALIC':
        return <ItalicSpan key={index} value={content.value} />;

      case 'INLINE_CODE':
        return <CodeElement key={index} value={content.value} />;

      case 'MENTION_CHANNEL':
        return <ChannelMention key={index} mention={content.value.value} />;

      case 'MENTION_USER':
        return <Mention key={index} value={content.value} />;

      case 'EMOJI':
        return <Emoji key={index} emoji={content} />;

      case 'COLOR':
        return <ColorElement key={index} {...content.value} />;

      case 'LINK':
        return (
          <LinkSpan
            key={index}
            href={content.value.src.value}
            label={
              Array.isArray(content.value.label)
                ? content.value.label
                : [content.value.label]
            }
          />
        );
      default:
        return null;
    }
  });

export default InlineElements;
