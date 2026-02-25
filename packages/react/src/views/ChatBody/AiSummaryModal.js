import React from 'react';
import { Modal, Icon, Button } from '@embeddedchat/ui-elements';
import { Markdown } from '../Markdown';
import useAiStore from '../../store/aiStore';

const AiSummaryModal = () => {
  const { isSummaryModalOpen, setSummaryModalOpen, summaryContent } = useAiStore();

  if (!isSummaryModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryContent);
  };

  return (
    <Modal onClose={() => setSummaryModalOpen(false)}>
      <Modal.Header>
        <Modal.Title>
          <Icon name="attachment" size="1.5rem" style={{ marginRight: '8px' }} />
          AI Conversation Summary
        </Modal.Title>
        <Modal.Close onClick={() => setSummaryModalOpen(false)} />
      </Modal.Header>
      <Modal.Content style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
        <Markdown body={summaryContent} />
      </Modal.Content>
      <Modal.Footer>
        <Button onClick={handleCopy} ghost>
          <Icon name="copy" size="1rem" style={{ marginRight: '4px' }} />
          Copy
        </Button>
        <Button onClick={() => setSummaryModalOpen(false)} type="primary">
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AiSummaryModal;
