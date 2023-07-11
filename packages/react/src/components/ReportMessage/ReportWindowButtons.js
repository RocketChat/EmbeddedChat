import { Modal, Box, Icon, ActionButton } from '@rocket.chat/fuselage';
import React, { useContext } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import PropTypes from 'prop-types';
import classes from './MessageReporter.module.css';
import { useMessageStore, useToastStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Button } from '../Button';

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
        position: toastPosition,
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in reporting message',
        position: toastPosition,
      });
    }

    handleOnClose();
  };

  return (
    <Modal>
      <Modal.Header>
        <Icon name="report" size="x20" />
        <Modal.Title>Report this message?</Modal.Title>
        <ActionButton
          onClick={handleOnClose}
          ghost
          display="inline"
          square
          small
          className={classes.close}
        >
          <Icon name="cross" size="x20" />
        </ActionButton>
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <Box className={classes.reportWindowFooter}>
          <Button color="secondary" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button onClick={handleReportMessage} color="error">
            Report message
          </Button>
        </Box>
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
