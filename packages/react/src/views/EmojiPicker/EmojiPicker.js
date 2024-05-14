import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';

const CustomEmojiPicker = ({ handleEmojiClick }) => (
  <Box>
    <EmojiPicker onEmojiClick={handleEmojiClick} />
  </Box>
);

export default CustomEmojiPicker;

CustomEmojiPicker.propTypes = {
  handleEmojiClick: PropTypes.func,
};
