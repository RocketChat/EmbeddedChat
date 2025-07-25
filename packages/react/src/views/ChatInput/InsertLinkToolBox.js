import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, useTheme } from '@embeddedchat/ui-elements';
import validator from 'validator';
import { getInsertLinkModalStyles } from './ChatInput.styles';

const InsertLinkToolBox = ({
  handleAddLink,
  selectedText,
  onClose = () => {},
}) => {
  const { theme } = useTheme();
  const styles = getInsertLinkModalStyles(theme);
  const [linkText, setLinkText] = useState(selectedText || '');
  const [linkUrl, setLinkUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);

  const validateUrl = (url) =>
    validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      disallow_auth: true,
    });

  useEffect(() => {
    const isValid = validateUrl(linkUrl);
    setIsUrlValid(isValid);
  }, [linkUrl]);

  const handleLinkTextOnChange = (e) => {
    setLinkText(e.target.value);
  };
  const handleLinkUrlOnChange = (e) => {
    const url = e.target.value.trim();
    setLinkUrl(url);
    setIsUrlValid(url ? validateUrl(url) : false);
  };

  const handleAdd = () => {
    if (!isUrlValid) return;
    handleAddLink(linkText, linkUrl);
  };

  return (
    <Modal>
      <Modal.Header css={styles.modalHeader}>
        <Modal.Title>Add link</Modal.Title>
        <Modal.Close onClick={onClose} />
      </Modal.Header>
      <Modal.Content css={styles.modalContent}>
        <Input
          type="text"
          onChange={handleLinkTextOnChange}
          value={linkText}
          placeholder="Text"
          css={styles.inputWithFormattingBox}
        />
        <Input
          type="text"
          onChange={handleLinkUrlOnChange}
          value={linkUrl}
          placeholder="URL"
          css={styles.inputWithFormattingBox}
        />
      </Modal.Content>
      <Modal.Footer css={styles.modalFooter}>
        <Button type="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleAdd}
          disabled={!isUrlValid || !linkText.trim()}
          title={!isUrlValid ? 'Please enter a valid URL' : ''}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InsertLinkToolBox;
