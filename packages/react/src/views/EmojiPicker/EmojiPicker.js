import React from 'react';
import { createPortal } from 'react-dom';
import EmojiPicker from 'emoji-picker-react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import getEmojiPickerStyles from './EmojiPicker.styles';

const CustomEmojiPicker = ({
  handleEmojiClick,
  onClose = () => { },
}) => {
  const theme = useTheme();
  const styles = getEmojiPickerStyles(theme);

  const internalHandleEmojiClick = (emojiData, event) => {
    setTimeout(() => {
      handleEmojiClick(emojiData, event);
    }, 0);
  };

  const portalStyles = {
    position: 'fixed',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 99999,
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 8px 30px rgba(0,0,0,0.2)',
    border: '1px solid #ebebeb',
    width: 'min(350px, 90vw)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const pickerUI = (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.05)' }}
      />

      <div style={portalStyles}>
        <Box style={{ padding: 0, margin: 0, border: 'none', display: 'block' }}>
          <EmojiPicker
            height={400}
            width="100%"
            onEmojiClick={internalHandleEmojiClick}
            previewConfig={{ showPreview: true, defaultCaption: 'None' }}
            emojiStyle="facebook"
            lazyLoadEmojis
            searchDisabled={false}
            skinTonesDisabled
          />
        </Box>
      </div>
    </>
  );

  return createPortal(pickerUI, document.body);
};

export default CustomEmojiPicker;