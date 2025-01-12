import React, { useState } from 'react';
import { Modal, Input, Button, useTheme } from '@embeddedchat/ui-elements';
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

  return (
    <Modal>
      <Modal.Header css={styles.modalHeader}>
        <Modal.Title>Add link</Modal.Title>
        <Modal.Close onClick={onClose} />
      </Modal.Header>
      <Modal.Content css={styles.modalContent}>
        <p htmlFor="linkText" style={{ marginLeft: '1rem' }}>
          Text
        </p>
        <Input
          id="linkText"
          type="text"
          onChange={handleLinkTextOnChange}
          value={linkText}
          css={styles.inputWithFormattingBox}
        />
        <p htmlFor="linkUrl" style={{ marginLeft: '1rem' }}>
          URL
        </p>
        <Input
          id="linkUrl"
          type="text"
          onChange={handleLinkUrlOnChange}
          css={styles.inputWithFormattingBox}
        />
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
