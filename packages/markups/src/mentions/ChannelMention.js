import React from 'react';
import PropTypes from 'prop-types';

const ChannelMention = ({ mention }) => <>#{mention}</>;

export default ChannelMention;

ChannelMention.propTypes = {
  mention: PropTypes.string,
};
