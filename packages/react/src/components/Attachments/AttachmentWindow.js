import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import ValidateComponent from './AttachmentWindow/validateComponent';
import Backdrop from './AttachmentWindow/Backdrop';
import RCContext from '../../context/RCInstance';
import styles from './AttachmentWindow.module.css';
import { useMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';

function AttachmentWindow() {
  const { RCInstance, ECOptions } = useContext(RCContext);

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const data = useAttachmentWindowStore((state) => state.data);
  const setData = useAttachmentWindowStore((state) => state.setData);

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
    <Backdrop>
      <Box>
        <Box
          aria-hidden="true"
          onClick={toggle}
          className={styles.attachment_window_background}
        />
        <Box className={styles.attachment_window_background_standin}>
          <Box className={styles.attachment_window}>
            <Box className={styles.attachment_window_header}>
              <div>File Upload</div>
              <div
                aria-hidden="true"
                onClick={toggle}
                style={{ display: 'inline' }}
                className={styles.attachment_window_close}
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
                <Box className={styles.attachment_window_input_container}>
                  <span style={{ fontWeight: '550' }}>File name</span>
                  <input
                    onChange={(e) => {
                      handleFileName(e);
                    }}
                    value={fileName}
                    className={styles.attachment_window_input}
                    placeholder="name"
                  />
                </Box>

                <Box className={styles.attachment_window_input_container}>
                  <span style={{ fontWeight: '550' }}>File description</span>
                  <input
                    onChange={(e) => {
                      handleFileDescription(e);
                    }}
                    value={fileDescription}
                    className={styles.attachment_window_input}
                    placeholder="Description"
                  />
                </Box>
              </Box>
            </Box>
            <Box className={styles.attachment_window_submit_container}>
              <Box>
                <button
                  type="button"
                  onClick={toggle}
                  className={styles.attachment_window_cancel_button}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submit}
                  className={styles.attachment_window_submit_button}
                >
                  Send
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
