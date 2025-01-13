import React, { useEffect } from 'react';
import getPreviewMessageStyles from './PreviewMessage.styles';
import {
  useComponentOverrides,
  useTheme,
  Box,
  ActionButton,
  Icon,
} from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import { marked } from 'marked';
import Dompurify from 'dompurify';

const PreviewMessage = ({ className = '', style = {}, message }) => {
  const { theme } = useTheme();
  const styles = getPreviewMessageStyles(theme);
  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
  const removePreviewMessage = useMessageStore(
    (state) => state.removePreviewMessage
  );

  const formatMessage = () => {
    const markedText = marked.parse(message);
    const sanitizedText = Dompurify.sanitize(markedText);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedText }} />;
  };

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
        {formatMessage()}
      </Box>
    </Box>
  );
};

export default PreviewMessage;
