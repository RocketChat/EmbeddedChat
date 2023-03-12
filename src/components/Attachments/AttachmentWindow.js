import React, { useContext, useState } from 'react';
import { Box } from '@rocket.chat/fuselage';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import ValidateComponent from './AttachmentWindow/validateComponent';
import RCContext from '../../context/RCInstance';
import styles from './AttachmentWindow.module.css';
import { useMessageStore } from '../../store';

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
        className={styles.attachment_window_background}
      />
      <Box className={styles.attachment_window_background_standin}>
        <Box className={styles.attachment_window}>
          <Box className={styles.attachment_window_header}>
            <div>File Upload</div>
            <div
              aria-hidden="true"
              onClick={toggle}
              className={styles.attachment_window_close}
            >
              X
            </div>
          </Box>
          <ValidateComponent data={data} />
          <Box style={{ marginTop: '20px' }}>
            <Box className={styles.attachment_window_input_container}>
              <span>File name</span>
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
              <span>File description</span>
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
          <Box className={styles.attachment_window_submit_container}>
            <button
              type="button"
              onClick={toggle}
              style={{ background: '#e1e1e1', marginRight: '5px' }}
              className={styles.attachment_window_submit_button}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              style={{ background: '#9EC8E2', marginLeft: '5px' }}
              className={styles.attachment_window_submit_button}
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
