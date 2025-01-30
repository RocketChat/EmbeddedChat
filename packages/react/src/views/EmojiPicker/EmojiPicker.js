import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Popup, useTheme } from '@embeddedchat/ui-elements';
import getEmojiPickerStyles from './EmojiPicker.styles';

const CustomEmojiPicker = ({
  handleEmojiClick,
  positionStyles = css`
    position: absolute;
    top: 0;
    right: 0;
  `,
  wrapperId = 'emoji-popup',
  onClose = () => {},
}) => {
  const theme = useTheme();
  const styles = getEmojiPickerStyles(theme);
  const previewConfig = {
    defaultEmoji: '1f60d',
    defaultCaption: 'None',
    showPreview: true,
  };

  return (
    <Popup
      positionStyles={positionStyles}
      wrapperId={wrapperId}
      onClose={onClose}
      height="auto"
      width="auto"
    >
      <Box css={styles.emojiPicker}>
        <EmojiPicker
          height={400}
          width={350}
          onEmojiClick={handleEmojiClick}
          previewConfig={previewConfig}
          searchDisabled={false}
          emojiStyle="facebook"
          lazyLoadEmojis
        />
      </Box>
    </Popup>
  );
};

export default CustomEmojiPicker;

CustomEmojiPicker.propTypes = {
  handleEmojiClick: PropTypes.func,
};
