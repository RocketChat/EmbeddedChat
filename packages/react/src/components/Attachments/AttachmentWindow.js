import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import ValidateComponent from './AttachmentWindow/validateComponent';
import Backdrop from './AttachmentWindow/Backdrop';
import RCContext from '../../context/RCInstance';
import { useMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';

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
  border: 2px solid #ffffff !important;
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
  display: inline;
  border-radius: 4px;
  padding: 5px 5px 0 5px;

  &:hover {
    background-color: #e9e9e9;
    display: inline;
  }

  &:active {
    background-color: #8f9194;
  }
`;

const attachmentWindowInputContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 20px 0 0 0 !important;
`;

const attachmentWindowInput = css`
  margin-top: 5px;
  border: 1px solid rgb(184, 184, 184);
  width: 95.5%;
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
  background: #007fff;
  margin-left: 5px;
  color: #ffffff;

  &:hover {
    background-color: #005bb6;
  }

  &:active {
    background-color: #003f7e;
  }

  &[disabled] {
    background-color: rgb(168, 176, 179);
  }
`;

const attachmentWindowCancelButton = css`
  padding: 10px !important;
  width: 80px;
  outline: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e4e7ea;
  margin-right: 5px;

  &:hover {
    background-color: #b2b5ba;
  }

  &:active {
    background-color: #85878b;
  }
`;

function AttachmentWindow() {
  const { RCInstance, ECOptions } = useContext(RCContext);

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const data = useAttachmentWindowStore((state) => state.data);
  const setData = useAttachmentWindowStore((state) => state.setData);
  const [isPending, setIsPending] = useState(false);

  const [fileName, setFileName] = useState(data?.name);
  const [fileDescription, setFileDescription] = useState('');

  const threadId = useMessageStore((state) => state.threadMainMessage?._id);
  const handleFileName = (e) => {
    setFileName(e.target.value);
  };

  const handleFileDescription = (e) => {
    setFileDescription(e.target.value);
  };

  const submit = async () => {
    setIsPending(true);
    await RCInstance.sendAttachment(
      data,
      fileName,
      fileDescription,
      ECOptions?.enableThreads ? threadId : undefined
    );
    toggle();
    setData(null);
    setIsPending(false);
  };
  return (
    <Backdrop>
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
                style={{ display: 'inline' }}
                css={attachmentWindowClose}
              >
                <Icon name="cross" size="1.25rem" />
              </div>
            </Box>
            <Box
              css={css`
                overflow-y: auto;
                overflow-x: hidden;
                max-height: 350px;
                scrollbar-width: thin;
                scrollbar-color: #e0e0e1 transparent;
                &::-webkit-scrollbar {
                  width: 4px;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: #e0e0e1;
                  border-radius: 4px;
                }
                &::-webkit-scrollbar-thumb:hover {
                  background-color: #e0e0e1;
                }
                &::-webkit-scrollbar-track {
                  background-color: transparent;
                }
              `}
            >
              <Box
                css={css`
                  text-align: center;
                `}
              >
                <ValidateComponent data={data} />
              </Box>
              <Box style={{ margin: '30px' }}>
                <Box css={attachmentWindowInputContainer}>
                  <span style={{ fontWeight: '550' }}>File name</span>
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
                  <span style={{ fontWeight: '550' }}>File description</span>
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
            </Box>
            <Box css={attachmentWindowSubmitContainer}>
              <Box>
                <button
                  type="button"
                  onClick={toggle}
                  css={attachmentWindowCancelButton}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submit}
                  css={attachmentWindowSubmitButton}
                  disabled={isPending}
                >
                  {isPending ? 'Sending...' : 'Send'}
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Backdrop>
  );
}

export default AttachmentWindow;
