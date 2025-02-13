import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  Button,
  Icon,
  Modal,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
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
        message: i18n.t('Toast_Message_Reported'),
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: i18n.t('Toast_Error_In_Reporting_Message'),
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
          {i18n.t('Report_this_message')}
        </Modal.Title>
        <Modal.Close onClick={handleOnClose} />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer>
        <Button type="secondary" onClick={handleOnClose}>
          {i18n.t('Cancel')}
        </Button>
        <Button onClick={handleReportMessage} type="destructive">
          {i18n.t('Report_message')}
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
