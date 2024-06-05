import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import FilePreviewContainer from './FilePreviewContainer';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import FilePreviewHeader from './FilePreviewHeader';
import { MessageBody } from '../Message/MessageBody';
import { appendClassNames } from '../../lib/appendClassNames';
import { FileMetrics } from './FileMetrics';
import { Menu } from '../../components/Menu';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import { useRCContext } from '../../context/RCInstance';
import { useMessageStore } from '../../store';
import { fileDisplayStyles as styles } from './Files.styles';

const FileMessage = ({ fileMessage }) => {
  const { classNames, styleOverrides } = useComponentOverrides('FileMessage');
  const dispatchToastMessage = useToastBarDispatch();
  const { RCInstance } = useRCContext();
  const messages = useMessageStore((state) => state.messages);

  const [fileToDelete, setFileToDelete] = useState({});

  const downloadFile = useCallback((url, title) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = title;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const deleteFile = useCallback(
    async (file) => {
      messages.forEach(async (message) => {
        if (message.file?._id === file._id) {
          const res = await RCInstance.deleteMessage(message._id);
          setFileToDelete({});
          if (res.success) {
            dispatchToastMessage({
              type: 'success',
              message: 'File deleted',
            });
          } else {
            dispatchToastMessage({
              type: 'error',
              message: 'Error in deleting file',
            });
          }
        }
      });
    },
    [messages, RCInstance, dispatchToastMessage]
  );

  const handleOnClose = () => {
    setFileToDelete({});
  };

  return (
    <>
      {fileToDelete &&
        typeof fileToDelete === 'object' &&
        Object.keys(fileToDelete).length > 0 && (
          <Modal onClose={handleOnClose}>
            <Modal.Header>
              <Modal.Title>
                <Icon
                  name="trash"
                  size="1.25rem"
                  style={{ marginRight: '0.5rem' }}
                />
                Are you sure?
              </Modal.Title>
              <Modal.Close onClick={handleOnClose} />
            </Modal.Header>
            <Modal.Content css={styles.modalContent}>
              Deleting a file will delete it forever. This cannot be undone.
            </Modal.Content>
            <Modal.Footer>
              <Button type="secondary" onClick={handleOnClose}>
                Cancel
              </Button>
              <Button
                type="destructive"
                onClick={() => {
                  deleteFile(fileToDelete);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      <Box
        className={appendClassNames('ec-file', classNames)}
        style={styleOverrides}
        css={styles.message}
      >
        <FilePreviewContainer file={fileMessage} />
        <MessageBodyContainer style={{ width: '75%' }}>
          <FilePreviewHeader file={fileMessage} isTimeStamped={false} />
          <MessageBody>
            <Box css={styles.previewUsername}>
              @{fileMessage.user?.username}
            </Box>
          </MessageBody>
          <FileMetrics file={fileMessage} />
        </MessageBodyContainer>
        <Menu
          isToolTip={false}
          options={[
            {
              id: 'download',
              action: () => downloadFile(fileMessage?.url, fileMessage.title),
              label: 'Download',
              icon: 'circle-arrow-down',
            },
            {
              id: 'delete',
              action: () => setFileToDelete(fileMessage),
              label: 'Delete',
              icon: 'trash',
            },
          ]}
        />
      </Box>
    </>
  );
};

FileMessage.propTypes = {
  fileMessage: PropTypes.any.isRequired,
};

export default memo(FileMessage);
