import { css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import ValidateComponent from './AttachmentWindow/validateComponent';
import RCContext from '../../context/RCInstance';
import { useMessageStore } from '../../store';
import { Box } from '../Box';

const attachmentWindowBackground = css`
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const attachmentWindowBackgroundStandin = css`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const attachmentWindow = css`
  z-index: 1000;
  width: 550px;
  background: white;
  padding: 30px !important;
  border: 2px solid #b8b8b8 !important;
  border-radius: 20px;
`;

const attachmentWindowHeader = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: x-large;
  margin: 0px 0px 15px 0px !important;
`;

const attachmentWindowClose = css`
  cursor: pointer !important;
  font-weight: 500;
  font-size: large;
`;

const attachmentWindowInputContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 10px 0px !important;
`;

const attachmentWindowInput = css`
  margin-top: 5px;
  border: 2px solid rgb(184, 184, 184);
  width: 94%;
  padding: 10px !important;
  border-radius: 5px;
`;

const attachmentWindowSubmitContainer = css`
  padding-top: 20px !important;
  width: 100%;
  display: flex;
  background: white;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-end;
`;

const attachmentWindowSubmitButton = css`
  padding: 10px !important;
  width: 80px;
  outline: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function AttachmentWindow() {
  const { RCInstance, ECOptions } = useContext(RCContext);

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const data = useAttachmentWindowStore((state) => state.data);
  const setData = useAttachmentWindowStore((state) => state.setData);

  const [fileName, setFileName] = useState(data.name);
  const [fileDescription, setFileDescription] = useState('');

  const threadId = useMessageStore((state) => state.threadMainMessage?._id);
  const handleFileName = (e) => {
    setFileName(e.target.value);
  };

  const handleFileDescription = (e) => {
    setFileDescription(e.target.value);
  };

  const submit = async () => {
    await RCInstance.sendAttachment(
      data,
      fileName,
      fileDescription,
      ECOptions?.enableThreads ? threadId : undefined
    );
    toggle();
    setData(null);
  };
  return (
    <Box>
      <Box
        aria-hidden="true"
        onClick={toggle}
        css={attachmentWindowBackground}
      />
      <Box css={attachmentWindowBackgroundStandin}>
        <Box css={attachmentWindow}>
          <Box css={attachmentWindowHeader}>
            <div>File Upload</div>
            <div
              aria-hidden="true"
              onClick={toggle}
              css={attachmentWindowClose}
            >
              X
            </div>
          </Box>
          <ValidateComponent data={data} />
          <Box style={{ marginTop: '20px' }}>
            <Box css={attachmentWindowInputContainer}>
              <span>File name</span>
              <input
                onChange={(e) => {
                  handleFileName(e);
                }}
                value={fileName}
                css={attachmentWindowInput}
                placeholder="name"
              />
            </Box>

            <Box css={attachmentWindowInputContainer}>
              <span>File description</span>
              <input
                onChange={(e) => {
                  handleFileDescription(e);
                }}
                value={fileDescription}
                css={attachmentWindowInput}
                placeholder="Description"
              />
            </Box>
          </Box>
          <Box css={attachmentWindowSubmitContainer}>
            <button
              type="button"
              onClick={toggle}
              style={{ background: '#e1e1e1', marginRight: '5px' }}
              css={attachmentWindowSubmitButton}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              style={{ background: '#9EC8E2', marginLeft: '5px' }}
              css={attachmentWindowSubmitButton}
            >
              Send
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AttachmentWindow;
