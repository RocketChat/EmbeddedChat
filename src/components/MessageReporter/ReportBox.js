import { Button, Modal, Icon, ActionButton } from '@rocket.chat/fuselage';
import React from 'react';
import classes from './MessageReporter.module.css';
import { useMessageStore } from '../../store';

const ReportBox = (
  children,
  cancelText,
  confirmText,
  onConfirm,
  confirmDisabled,
  variant,
  dontAskAgain
) => {
  const [toggleReportMessage, setMessageToReport] = useMessageStore((state) => [
    state.toggleShowReportMessage,
    state.setMessageToReport,
  ]);
  const handleOnClose = () => {
    toggleReportMessage();
    setMessageToReport(NaN);
  };
  onCancel = handleOnClose;
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
      <Modal.Content>{children.children}</Modal.Content>
      <Modal.Footer justifyContent={dontAskAgain ? 'space-between' : 'end'}>
        {onCancel && (
          <Button secondary onClick={onCancel}>
            {cancelText ?? 'Cancel'}
          </Button>
        )}
        <Button onClick={onConfirm} disabled={confirmDisabled}>
          {confirmText ?? 'Ok'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportBox;
