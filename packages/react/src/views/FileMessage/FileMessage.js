import React, { useState, useCallback, memo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Menu,
  Modal,
  Button,
  Icon,
  useToastBarDispatch,
  useComponentOverrides,
  appendClassNames,
  useTheme,
  lighten,
  darken,
} from '@embeddedchat/ui-elements';
import FilePreviewContainer from './FilePreviewContainer';
import FileBodyContainer from '../Message/MessageBodyContainer';
import ImageGallery from '../ImageGallery/ImageGallery';

import FilePreviewHeader from './FilePreviewHeader';
import { MessageBody as FileBody } from '../Message/MessageBody';
import { FileMetrics } from './FileMetrics';
import { useRCContext } from '../../context/RCInstance';
import { useMessageStore } from '../../store';
import { fileDisplayStyles as styles } from './Files.styles';

const FileMessage = ({ fileMessage }) => {
  const { classNames, styleOverrides } = useComponentOverrides('FileMessage');
  const dispatchToastMessage = useToastBarDispatch();
  const { RCInstance } = useRCContext();
  const messages = useMessageStore((state) => state.messages);
  const [showGallery, setShowGallery] = useState(false);

  const theme = useTheme();
  const { mode } = theme;
  const messageStyles = styles.message;

  const hoverStyle = {
    '&:hover': {
      backgroundColor:
        mode === 'light'
          ? darken(theme.theme.colors.background, 0.03)
          : lighten(theme.theme.colors.background, 1),
    },
  };

  const [fileToDelete, setFileToDelete] = useState({});

  const downloadFile = useCallback((url, title) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = title;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

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

  const handleFileClick = (file) => {
    if (file.typeGroup === 'image') {
      setShowGallery(true);
    } else {
      downloadFile(file.url, file.title);
    }
  };

  return (
    <>
      <Box
        className={appendClassNames('ec-file', classNames)}
        style={styleOverrides}
        css={[messageStyles, hoverStyle]}
        onClick={() => {
          handleFileClick(fileMessage);
        }}
      >
        <FilePreviewContainer file={fileMessage} />
        <FileBodyContainer style={{ width: '75%' }}>
          <FilePreviewHeader file={fileMessage} isTimeStamped={false} />
          <FileBody>
            <Box css={styles.previewUsername}>
              @{fileMessage.user?.username}
            </Box>
          </FileBody>
          <FileMetrics file={fileMessage} />
        </FileBodyContainer>
        <Menu
          tooltip={{
            isToolTip: false,
          }}
          options={[
            {
              id: 'download',
              action: () => downloadFile(fileMessage?.url, fileMessage?.title),
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

      {showGallery && (
        <ImageGallery
          currentFileId={extractIdFromUrl(fileMessage.url)}
          setShowGallery={setShowGallery}
        />
      )}

      {fileToDelete && Object.keys(fileToDelete).length > 0 && (
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
            <Button type="destructive" onClick={() => deleteFile(fileToDelete)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

FileMessage.propTypes = {
  fileMessage: PropTypes.any.isRequired,
};

export default memo(FileMessage);
