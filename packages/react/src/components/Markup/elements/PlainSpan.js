import React from 'react';
import PropTypes from 'prop-types';

const PlainSpan = ({ contents }) => <>{contents}</>;

export default PlainSpan;

PlainSpan.propTypes = {
  contents: PropTypes.string,
};
