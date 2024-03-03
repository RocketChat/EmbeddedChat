import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMessageStore, useToastStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';

const ReportWindowButtons = ({ children, reportDescription, messageId }) => {
  const [toggleReportMessage, setMessageToReport] = useMessageStore((state) => [
    state.toggleShowReportMessage,
    state.setMessageToReport,
  ]);
  const { RCInstance } = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();
  const toastPosition = useToastStore((state) => state.position);

  const handleOnClose = () => {
    toggleReportMessage();
    setMessageToReport(NaN);
  };

  const handleReportMessage = async () => {
    const res = await RCInstance.reportMessage(messageId, reportDescription);

    if (res.success) {
      dispatchToastMessage({
        type: 'success',
        message: 'Message reported successfully',
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in reporting message',
      });
    }

    handleOnClose();
  };

  return (
    <Modal onClose={handleOnClose}>
      <Modal.Header>
        <Modal.Title>
          <Icon
            name="report"
            size="1.25rem"
            style={{ marginRight: '0.5rem' }}
          />
          Report this message?
        </Modal.Title>
        <Modal.Close onClick={handleOnClose} />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <Button color="secondary" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button onClick={handleReportMessage} color="error">
          Report message
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ReportWindowButtons.propTypes = {
  children: PropTypes.object.isRequired,
  reportDescription: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default ReportWindowButtons;
