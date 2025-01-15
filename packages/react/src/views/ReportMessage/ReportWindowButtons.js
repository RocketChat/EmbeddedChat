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
import { Markdown } from '../Markdown';
import Attachment from '../AttachmentHandler/Attachment';

const ReportWindowButtons = ({
  children,
  reportDescription,
  messageId,
  message,
}) => {
  const [toggleReportMessage, setMessageToReport] = useMessageStore((state) => [
    state.toggleShowReportMessage,
    state.setMessageToReport,
  ]);
  const { RCInstance } = useContext(RCContext);
  const instanceHost = RCInstance.getHost();
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
      <Modal.Content
        style={{
          overflow: 'scroll',
          whiteSpace: 'wrap',
          padding: '1rem',
          maxHeight: '50vh',
        }}
      >
        {message.file ? (
          message.file.type.startsWith('image/') ? (
            <div>
              <img
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                alt={message.file.name}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
              <div>{`${message.file.name} (${(message.file.size / 1024).toFixed(
                2
              )} kB)`}</div>
            </div>
          ) : message.file.type.startsWith('video/') ? (
            <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
              <source
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                type={message.file.type}
              />
              Your browser does not support the video tag.
            </video>
          ) : message.file.type.startsWith('audio/') ? (
            <audio controls style={{ maxWidth: '100%' }}>
              <source
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                type={message.file.type}
              />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <Markdown body={message} md={message.md} isReaction={false} />
          )
        ) : (
          <Markdown body={message} md={message.md} isReaction={false} />
        )}
        {message.attachments &&
          message.attachments.length > 0 &&
          message.msg &&
          message.msg[0] === '[' &&
          message.attachments.map((attachment, index) => (
            <Attachment
              key={index}
              attachment={attachment}
              type={attachment.type}
              host={instanceHost}
            />
          ))}
      </Modal.Content>
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
