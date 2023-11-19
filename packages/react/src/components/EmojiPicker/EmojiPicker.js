import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import PropTypes from 'prop-types';
import styles from './CustomEmojiPicker.module.css';

const CustomEmojiPicker = ({ handleEmojiClick }) => (
  <>
  <div className={styles.box}>
    <div className={styles.box}>
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  </div>
  </>
);

export default CustomEmojiPicker;

CustomEmojiPicker.propTypes = {
  handleEmojiClick: PropTypes.func,
};
