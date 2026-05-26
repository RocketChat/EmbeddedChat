import React, { useEffect, useRef } from 'react';
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
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const internalHandleEmojiClick = (emojiData, event) => {
    if (isMountedRef.current) {
      handleEmojiClick(emojiData, event);
    }
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