import React, { useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import {
  Box,
  Icon,
  Popup,
  ReactPortal,
  useTheme,
} from '@embeddedchat/ui-elements';
import useIsMobileViewport from '../../hooks/useIsMobileViewport';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import getEmojiPickerStyles from './EmojiPicker.styles';

const MobileEmojiSheet = ({ children, onClose, styles }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    sheetRef.current?.focus();
  }, []);

  return (
    <Box
      ref={sheetRef}
      css={styles.mobileSheet}
      role="dialog"
      aria-modal="true"
      aria-label="Emoji picker"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <Box css={styles.mobileSheetHeader}>
        <Box
          is="button"
          type="button"
          css={styles.mobileSheetClose}
          aria-label="Close emoji picker"
          onClick={onClose}
        >
          <Icon name="cross" size="1rem" />
        </Box>
      </Box>
      <Box css={[styles.emojiPicker, styles.mobileEmojiPicker]}>{children}</Box>
    </Box>
  );
};

MobileEmojiSheet.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    emojiPicker: PropTypes.object,
    mobileEmojiPicker: PropTypes.object,
    mobileSheet: PropTypes.object,
    mobileSheetHeader: PropTypes.object,
    mobileSheetClose: PropTypes.object,
  }).isRequired,
};

const CustomEmojiPicker = ({
  handleEmojiClick,
  positionStyles = css`
    position: absolute;
    top: 0;
    right: 0;
  `,
  wrapperId = 'emoji-popup',
  onClose = () => {},
  useMobileBottomSheet = false,
}) => {
  const theme = useTheme();
  const styles = getEmojiPickerStyles(theme);
  const isMobileViewport = useIsMobileViewport();
  const isMobileBottomSheet = useMobileBottomSheet && isMobileViewport;
  const returnFocusRef = useRef(null);
  const previewConfig = {
    defaultEmoji: '1f60d',
    defaultCaption: 'None',
    showPreview: true,
  };

  useLockBodyScroll(isMobileBottomSheet);

  useEffect(() => {
    if (!isMobileBottomSheet || typeof document === 'undefined') {
      return undefined;
    }

    returnFocusRef.current = document.activeElement;

    return () => {
      if (returnFocusRef.current?.focus) {
        returnFocusRef.current.focus({ preventScroll: true });
      }
      returnFocusRef.current = null;
    };
  }, [isMobileBottomSheet]);

  if (isMobileBottomSheet) {
    return (
      <ReactPortal wrapperId={wrapperId}>
        <Box css={styles.mobileSheetBackdrop} onClick={onClose} />
        <MobileEmojiSheet onClose={onClose} styles={styles}>
          <EmojiPicker
            height="100%"
            width="100%"
            onEmojiClick={handleEmojiClick}
            previewConfig={previewConfig}
            autoFocusSearch={false}
            searchDisabled={false}
            emojiStyle="facebook"
            lazyLoadEmojis
          />
        </MobileEmojiSheet>
      </ReactPortal>
    );
  }

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
          autoFocusSearch
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
  useMobileBottomSheet: PropTypes.bool,
};
