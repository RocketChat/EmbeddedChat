import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';

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

const LinkSpan = ({ href, label, classes }) => {
  const contents = React.useMemo(() => {

    const labelArray = Array.isArray(label) ? label : [label];
    const labelElements = labelArray.map((content, index) => {
      return <PlainSpan contents={content.value} classes={classes} key={index} />
    })
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
  label: PropTypes.string,
  classes: PropTypes.object,
};
