import PropTypes from 'prop-types';
import React from 'react';
import PlainSpan from '../elements/PlainSpan';

const HeadingBlock = ({ contents, level = 1, classes }) => {
  const HeadingTag = `h${level}`;
  return (
    <HeadingTag>
      {contents.map((content, index) => (
        <PlainSpan key={index} contents={content.value} classes={classes} />
      ))}
    </HeadingTag>
  );
};

export default HeadingBlock;

HeadingBlock.propTypes = {
  contents: PropTypes.arrayOf(PropTypes.object),
  level: PropTypes.number,
  classes: PropTypes.object,
};
