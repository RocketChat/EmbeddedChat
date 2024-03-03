import React, { useState, useMemo, useEffect } from 'react';
import { css } from '@emotion/react';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import { useChannelStore, useFileStore } from '../../store';
import { useRCContext } from '../../context/RCInstance';
import { MessageBody } from '../Message/MessageBody';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import FilePreviewContainer from './FilePreviewContainer';
import FilePreviewHeader from './FilePreviewHeader';
import { FileMetrics } from './FileMetrics';

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

const componentStyle = css`
  position: fixed;
  right: 0;
  top: 0;
  width: 350px;
  height: 100%;
  overflow: hidden;
  background-color: white;
  box-shadow: -1px 0px 5px rgb(0 0 0 / 25%);
  z-index: 100;
  @media (max-width: 550px) {
    width: 100vw;
  }
`;

const wrapContainerStyle = css`
  height: 100%;
  display: flex;
  flex-direction: column;
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
  const setShowAllFiles = useFileStore((state) => state.setShowAllFiles);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);

  const [text, setText] = useState('');
  const [isFilesFetched, setIsFilesFetched] = useState(false);
  const [files, setFiles] = useState([]);

  const toggleShowAllFiles = () => {
    setShowAllFiles(false);
  };

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
  }, [RCInstance, isChannelPrivate, setFiles, setIsFilesFetched]);

  return (
    <Box css={componentStyle}>
      <Box css={wrapContainerStyle}>
        <Box style={{ padding: '16px' }}>
          <Box
            css={css`
              display: flex;
            `}
          >
            <h3 style={{ display: 'contents' }}>
              <Icon
                name="clip"
                size="1.25rem"
                style={{ padding: '0px 20px 20px 0px' }}
              />
              <Box
                css={css`
                  width: 100%;
                  color: #4a4a4a;
                `}
              >
                Files
              </Box>
              <ActionButton onClick={toggleShowAllFiles} ghost size="small">
                <Icon name="cross" size="1.25rem" />
              </ActionButton>
            </h3>
          </Box>

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
                      <MessageBodyContainer>
                        <FilePreviewHeader file={file} isTimeStamped={false} />
                        <MessageBody>
                          <div css={FilePreviewUsernameCss}>
                            @{file.user.username}
                          </div>
                        </MessageBody>
                        <FileMetrics file={file} />
                      </MessageBodyContainer>
                    </Box>
                  )
              )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Files;
