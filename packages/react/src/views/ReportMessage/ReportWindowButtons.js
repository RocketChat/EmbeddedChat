import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  Box,
  Button,
  Icon,
  Modal,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Markdown } from '../Markdown';

const ReportWindowButtons = ({
  children,
  reportDescription,
  messageId,
  confirmText,
  cancelText,
  message,
}) => {
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

  const messageDescription = (msg) => {
    if (msg.file) {
      if (msg.attachments[0]?.description) {
        return (
          <Markdown
            body={msg.attachments[0].description}
            md={msg.attachments[0].descriptionMd}
            isReaction={false}
          />
        );
      }
      return msg.file.name;
    }
    return <Markdown body={msg} md={msg.md} isReaction={false} />;
  };

  return (
    <Modal onClose={handleOnClose}>
      <Modal.Header>
        <Box
          css={css`
            margin: 0.7rem 0rem 0rem 0.45rem;
          `}
        >
          <Modal.Title>
            <Icon
              name="report"
              size="1.5rem"
              css={css`
                color: red;
                margin: 0.2rem 0.4rem 0rem 0rem;
              `}
            />
            Report this message?
          </Modal.Title>
        </Box>
        <Modal.Close onClick={handleOnClose} />
      </Modal.Header>
      <Box
        css={css`
          margin-top: 0.9rem;
          margin-left: 0.7rem;
          margin-right: 0.3rem;
          overflow-y: auto;
        `}
      >
        <Modal.Content>
          <Box
            css={css`
              margin: 1rem 0rem 1.5rem 0.5rem;
              font-size: 0.9rem;
            `}
          >
            {messageDescription(message)}
          </Box>
          <Box>{children}</Box>
        </Modal.Content>
      </Box>
      <Box
        css={css`
          margin-top: 1rem;
        `}
      >
        <Modal.Footer>
          <Button type="secondary" onClick={handleOnClose}>
            {cancelText}
          </Button>
          <Button
            onClick={handleReportMessage}
            type="destructive"
            disabled={reportDescription === ''}
          >
            {confirmText}
          </Button>
        </Modal.Footer>
      </Box>
    </Modal>
  );
};
ReportWindowButtons.propTypes = {
  children: PropTypes.object.isRequired,
  reportDescription: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default ReportWindowButtons;
