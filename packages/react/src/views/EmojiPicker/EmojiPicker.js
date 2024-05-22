import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import ReactPortal from '../../lib/reactPortal';
import useEmojiPickerStyles from './EmojiPicker.styles';

const CustomEmojiPicker = ({ handleEmojiClick }) => {
  const styles = useEmojiPickerStyles();

  const previewConfig = {
    defaultEmoji: '1f60d',
    defaultCaption: 'None',
    showPreview: false,
  };

  return (
    <ReactPortal wrapperId="overlay-items">
      <Box
        css={[
          styles.emojiPicker,
          css`
            position: absolute;
            top: 5rem;
            right: 1.5rem;
          `,
        ]}
      >
        <EmojiPicker
          height={350}
          width={300}
          onEmojiClick={handleEmojiClick}
          previewConfig={previewConfig}
          searchDisabled
          emojiStyle="facebook"
        />
      </Box>
    </ReactPortal>
  );
};

export default CustomEmojiPicker;

CustomEmojiPicker.propTypes = {
  handleEmojiClick: PropTypes.func,
};
