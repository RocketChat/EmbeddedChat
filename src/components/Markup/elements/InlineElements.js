import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import CodeElement from './CodeElement';
import Emoji from './Emoji';
import ChannelMention from '../mentions/ChannelMention';
import ColorElement from './ColorElement';
import LinkSpan from './LinkSpan';
import Mention from './Mention';

const InlineElements = ({ contents, classes }) => {
  const helperFunc = (contentsArr, initialClass) => {
    return (
      <>
        {contentsArr.map((content, index) => {
          let classProps = initialClass;

          switch (content.type) {
            case 'BOLD':
              classProps = { ...classProps, bold: true };
              break;

            case 'STRIKE':
              classProps = { ...classProps, strike: true };
              break;

            case 'ITALIC':
              classProps = { ...classProps, italics: true };
              break;

            case 'PLAIN_TEXT':
              return (
                <PlainSpan contents={content.value} classes={classProps} />
              );

            case 'INLINE_CODE':
              return (
                <CodeElement
                  key={index}
                  contents={content.value}
                  classes={classProps}
                />
              );

            case 'MENTION_CHANNEL':
              return (
                <ChannelMention
                  key={index}
                  mention={content.value.value}
                  classes={classProps}
                />
              );

            case 'MENTION_USER':
              return <Mention key={index} contents={content.value} />;

            case 'EMOJI':
              return <Emoji key={index} emoji={content} />;

            case 'COLOR':
              return (
                <ColorElement
                  key={index}
                  {...content.value}
                  classes={classProps}
                />
              );

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
                  classes={classProps}
                />
              );

            default:
              break;
          }
          return helperFunc(content.value, classProps);
        })}
      </>
    );
  };

  return <>{helperFunc(contents, classes)}</>;
};

export default InlineElements;

InlineElements.propTypes = {
  contents: PropTypes.any,
  classes: PropTypes.object,
};
