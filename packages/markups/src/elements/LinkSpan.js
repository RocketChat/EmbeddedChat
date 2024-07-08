import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import StrikeSpan from './StrikeSpan';
import ItalicSpan from './ItalicSpan';
import BoldSpan from './BoldSpan';

const getBaseURI = () => {
  if (document.baseURI) {
    return document.baseURI;
  }

  // Should be exactly one tag:
  //   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
  const base = document.getElementsByTagName('base');

  // Return location from BASE tag.
  if (base.length > 0) {
    return base[0].href;
  }

  // Else use implementation of documentURI:
  //   http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-baseURI
  return document.URL;
};

const isExternal = (href) => href.indexOf(getBaseURI()) !== 0;

const LinkSpan = ({ href, label }) => {
  const contents = React.useMemo(() => {
    const labelArray = Array.isArray(label) ? label : [label];

    const labelElements = labelArray.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} contents={content.value} />;

        case 'STRIKE':
          return <StrikeSpan key={index} contents={content.value} />;

        case 'ITALIC':
          return <ItalicSpan key={index} contents={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} contents={content.value} />;

        default:
          return null;
      }
    });

    return labelElements;
  }, [label]);

  if (isExternal(href)) {
    return (
      <a href={href} title={href} rel="noopener noreferrer" target="_blank">
        {contents}
      </a>
    );
  }
  return (
    <a href={href} title={href}>
      {contents}
    </a>
  );
};

export default LinkSpan;

LinkSpan.propTypes = {
  href: PropTypes.string,
  label: PropTypes.array,
};
