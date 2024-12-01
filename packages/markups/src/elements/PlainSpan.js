import React from 'react';
import PropTypes from 'prop-types';

const PlainSpan = ({ contents }) => {
  if (contents === '>') {
    return (
      <br />
    );
  }
  return <>{contents}</>;
};

export default PlainSpan;

PlainSpan.propTypes = {
  contents: PropTypes.string,
};
