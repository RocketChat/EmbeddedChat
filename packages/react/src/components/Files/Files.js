import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { css } from '@emotion/react';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { useChannelStore, useFileStore, useMessageStore } from '../../store';
import { useRCContext } from '../../context/RCInstance';
import { MessageBody } from '../Message/MessageBody';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import FilePreviewContainer from './FilePreviewContainer';
import FilePreviewHeader from './FilePreviewHeader';
import { FileMetrics } from './FileMetrics';
import Menu from '../Menu/Menu';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import Sidebar from '../Sidebar/Sidebar';

const MessageCss = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 0.5rem;
  -webkit-padding-before: 0.5rem;
  padding-block-start: 0.5rem;
  padding-bottom: 0.25rem;
  -webkit-padding-after: 0.25rem;
  padding-block-end: 0.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-inline: 1.25rem;
  cursor: pointer;
  &:hover {
    background: #f2f3f5;
  }
`;

const searchContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 2px solid #ddd;
  position: relative;
`;

const textInputStyle = css`
  width: 75%;
  height: 2.5rem;
  border: none;
  outline: none;
  &::placeholder {
    padding-left: 5px;
  }
`;

const FilePreviewUsernameCss = css`
  letter-spacing: 0rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  color: #6c727a;
`;

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
            <Modal.Content
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '0 0.5rem 0.5rem',
              }}
            >
              Deleting a file will delete it forever. This cannot be undone.
            </Modal.Content>
            <Modal.Footer>
              <Button color="secondary" onClick={handleOnClose}>
                Cancel
              </Button>
              <Button
                color="error"
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
      >
        <Box css={searchContainerStyle}>
          <input
            placeholder="Search Files"
            onChange={handleInputChange}
            css={textInputStyle}
          />

          <Icon
            name="magnifier"
            size="1.25rem"
            style={{ padding: '0.125em', cursor: 'pointer' }}
          />
        </Box>

        {isFilesFetched && (
          <Box
            style={{
              flex: '1',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: filteredFiles.length === 0 ? 'center' : 'initial',
              alignItems: filteredFiles.length === 0 ? 'center' : 'initial',
            }}
          >
            {filteredFiles.length === 0 ? (
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#4a4a4a',
                }}
              >
                <Icon
                  name="magnifier"
                  size="3rem"
                  style={{ padding: '0.5rem' }}
                />
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  No files found
                </span>
              </Box>
            ) : (
              filteredFiles.map(
                (file) =>
                  file.path && (
                    <Box key={file._id} css={MessageCss}>
                      <FilePreviewContainer
                        file={file}
                        sequential={false}
                        isStarred={false}
                      />
                      <MessageBodyContainer style={{ width: '75%' }}>
                        <FilePreviewHeader file={file} isTimeStamped={false} />
                        <MessageBody>
                          <div css={FilePreviewUsernameCss}>
                            @{file.user.username}
                          </div>
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
        )}
      </Sidebar>
    </>
  );
};

export default Files;
