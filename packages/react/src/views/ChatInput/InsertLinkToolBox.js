import React, { useState } from 'react';
import {
  Modal,
  Input,
  Button,
  useTheme,
  Icon,
  Box,
} from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';
import { getInsertLinkModalStyles } from './ChatInput.styles';

const InsertLinkToolBox = ({
  handleAddLink,
  selectedText,
  onClose = () => {},
}) => {
  const { theme } = useTheme();
  const styles = getInsertLinkModalStyles(theme);
  const [linkText, setLinkText] = useState(selectedText);
  const [linkUrl, setLinkUrl] = useState(null);

  const handleLinkTextOnChange = (e) => {
    setLinkText(e.target.value);
  };
  const handleLinkUrlOnChange = (e) => {
    setLinkUrl(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddLink(linkText, linkUrl);
    }
  };

  return (
    <Modal>
      <Modal.Header>
        <Icon
          name="link"
          size="1.5rem"
          css={css`
            margin-right: 0.25rem;
            margin-top: 0.5rem;
          `}
        />{' '}
        <Modal.Title>Add Link</Modal.Title>
        <Modal.Close onClick={onClose} />
      </Modal.Header>
      <Modal.Content>
        <Box css={styles.modalContent}>
          <Box
            is="span"
            css={css`
              font-weight: 550;
              margin-left: 1rem;
              font-size: 0.8rem;
            `}
          >
            Text
          </Box>
          <Input
            type="text"
            onChange={handleLinkTextOnChange}
            onKeyDown={handleKeyDown}
            css={styles.inputWithFormattingBox}
          />
          <Box
            is="span"
            css={css`
              font-weight: 550;
              margin-left: 1rem;
              font-size: 0.8rem;
            `}
          >
            URL
          </Box>
          <Input
            type="text"
            onChange={handleLinkUrlOnChange}
            onKeyDown={handleKeyDown}
            css={styles.inputWithFormattingBox}
          />
        </Box>
      </Modal.Content>
      <Modal.Footer css={styles.modalFooter}>
        <Button type="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="primary" onClick={() => handleAddLink(linkText, linkUrl)}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InsertLinkToolBox;
