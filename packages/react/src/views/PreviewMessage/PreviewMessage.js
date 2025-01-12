import React from 'react';
import getPreviewMessageStyles from './PreviewMessage.styles';
import {
  useComponentOverrides,
  useTheme,
  Box,
  ActionButton,
  Icon,
} from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import { css } from '@emotion/react';

const PreviewMessage = ({ className = '', style = {}, message }) => {
  const { theme } = useTheme();
  const styles = getPreviewMessageStyles(theme);
  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
  const removePreviewMessage = useMessageStore(
    (state) => state.removePreviewMessage
  );
  return (
    <Box
      className={`ec-quote-msg ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={styles.messageContainer}
    >
      <Box css={styles.actionBtn}>
        <ActionButton
          ghost
          onClick={() => removePreviewMessage(message)}
          size="small"
        >
          <Icon name="cross" size="0.75rem" />
        </ActionButton>
      </Box>
      <Box css={styles.message}>
        {message}
      </Box>
    </Box>
  );
};

export default PreviewMessage;