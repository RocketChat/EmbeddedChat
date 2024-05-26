import React, { useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import ReactPortal from '../../lib/reactPortal';
import useEmojiPickerStyles from './EmojiPicker.styles';

const CustomEmojiPicker = ({
  handleEmojiClick,
  positionStyles = css`
    position: absolute;
    top: 0;
    right: 0;
  `,
  onClose = () => {},
}) => {
  const styles = useEmojiPickerStyles();
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const previewConfig = {
    defaultEmoji: '1f60d',
    defaultCaption: 'None',
    showPreview: false,
  };

  return (
    <ReactPortal wrapperId="popup">
      <Box ref={emojiPickerRef} css={[styles.emojiPicker, positionStyles]}>
        <EmojiPicker
          height={350}
          width={300}
          onEmojiClick={handleEmojiClick}
          previewConfig={previewConfig}
          searchDisabled
          emojiStyle="facebook"
          lazyLoadEmojis
        />
      </Box>
    </ReactPortal>
  );
};

export default CustomEmojiPicker;

CustomEmojiPicker.propTypes = {
  handleEmojiClick: PropTypes.func,
};
