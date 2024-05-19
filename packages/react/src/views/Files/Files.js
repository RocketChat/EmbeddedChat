import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Icon } from '../../components/Icon';
import { Box } from '../../components/Box';
import { useChannelStore, useFileStore, useMessageStore } from '../../store';
import { useRCContext } from '../../context/RCInstance';
import { MessageBody } from '../Message/MessageBody';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import FilePreviewContainer from './FilePreviewContainer';
import FilePreviewHeader from './FilePreviewHeader';
import { FileMetrics } from './FileMetrics';
import Menu from '../../components/Menu/Menu';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Throbber } from '../../components/Throbber';
import { fileStyles as styles } from './Files.styles';

const Files = () => {
  const { RCInstance } = useRCContext();
  const dispatchToastMessage = useToastBarDispatch();

  const setShowAllFiles = useFileStore((state) => state.setShowAllFiles);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const messages = useMessageStore((state) => state.messages);

  const [text, setText] = useState('');
  const [isFilesFetched, setIsFilesFetched] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileToDelete, setFileToDelete] = useState({});

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        file.name.toLowerCase().includes(text.toLowerCase())
      ),
    [files, text]
  );

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

  useEffect(() => {
    const fetchAllFiles = async () => {
      const res = await RCInstance.getAllFiles(isChannelPrivate);
      if (res?.files) {
        const sortedFiles = res.files.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
        setFiles(sortedFiles);
        setIsFilesFetched(true);
      }
    };
    fetchAllFiles();
  }, [RCInstance, isChannelPrivate, setFiles, setIsFilesFetched, fileToDelete]);

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
              <Button color="secondary" onClick={handleOnClose}>
                Cancel
              </Button>
              <Button
                color="destructive"
                onClick={() => {
                  deleteFile(fileToDelete);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        )}

      <Sidebar
        title="Files"
        iconName="attachment"
        setShowWindow={setShowAllFiles}
        searchProps={{
          isSearch: true,
          handleInputChange,
          placeholder: 'Search Files',
        }}
      >
        {isFilesFetched ? (
          <Box css={styles.fileListContainer(filteredFiles)}>
            {filteredFiles.length === 0 ? (
              <Box css={styles.centeredColumnStyles}>
                <Icon
                  name="magnifier"
                  size="3rem"
                  style={{ padding: '0.5rem' }}
                />
                <Box
                  is="span"
                  style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  No files found
                </Box>
              </Box>
            ) : (
              filteredFiles.map(
                (file) =>
                  file.path && (
                    <Box key={file._id} css={styles.message}>
                      <FilePreviewContainer file={file} />
                      <MessageBodyContainer style={{ width: '75%' }}>
                        <FilePreviewHeader file={file} isTimeStamped={false} />
                        <MessageBody>
                          <Box css={styles.previewUsername}>
                            @{file.user.username}
                          </Box>
                        </MessageBody>
                        <FileMetrics file={file} />
                      </MessageBodyContainer>

                      <Menu
                        isToolTip={false}
                        options={[
                          {
                            id: 'download',
                            action: () => downloadFile(file.url, file.title),
                            label: 'Download',
                            icon: 'circle-arrow-down',
                          },
                          {
                            id: 'delete',
                            action: () => setFileToDelete(file),
                            label: 'Delete',
                            icon: 'trash',
                          },
                        ]}
                      />
                    </Box>
                  )
              )
            )}
          </Box>
        ) : (
          <Box css={styles.centeredColumnStyles}>
            <Throbber />
          </Box>
        )}
      </Sidebar>
    </>
  );
};

export default Files;
