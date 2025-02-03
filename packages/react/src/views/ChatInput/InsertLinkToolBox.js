import React, { useState } from 'react';
import { Modal, Input, Button, useTheme } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
import { getInsertLinkModalStyles } from './ChatInput.styles';

const InsertLinkToolBox = ({
  handleAddLink,
  selectedText,
  onClose = () => {},
}) => {
  const { theme } = useTheme();
  const styles = getInsertLinkModalStyles(theme);
  const [linkText, setLinkText] = useState(selectedText || 'Text');
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
        <Input
          type="text"
          onChange={handleLinkTextOnChange}
          value={linkText}
          css={styles.inputWithFormattingBox}
        />
        <Input
          type="text"
          onChange={handleLinkUrlOnChange}
          placeholder="URL"
          css={styles.inputWithFormattingBox}
        />
      </Modal.Content>
      <Modal.Footer css={styles.modalFooter}>
        <Button type="secondary" onClick={onClose}>
          {i18n.t('Cancel')}
        </Button>
        <Button type="primary" onClick={() => handleAddLink(linkText, linkUrl)}>
          {i18n.t('Add')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InsertLinkToolBox;
