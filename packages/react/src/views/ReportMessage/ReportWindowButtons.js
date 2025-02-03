import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  Button,
  Icon,
  Modal,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import RCContext from '../../context/RCInstance';

const ReportWindowButtons = ({ children, reportDescription, messageId }) => {
  const [toggleReportMessage, setMessageToReport] = useMessageStore((state) => [
    state.toggleShowReportMessage,
    state.setMessageToReport,
  ]);
  const { RCInstance } = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();

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
            css={css`
              margin-right: 0.5rem;
            `}
          />
          Report this message?
        </Modal.Title>
        <Modal.Close onClick={handleOnClose} />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <Button type="secondary" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button onClick={handleReportMessage} type="destructive">
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
