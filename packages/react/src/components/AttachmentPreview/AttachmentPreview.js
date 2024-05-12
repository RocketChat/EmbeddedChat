import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import CheckPreviewType from './CheckPreviewType';
import RCContext from '../../context/RCInstance';
import { useMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import styles from './AttachmentPreview.styles';

const AttachmentPreview = () => {
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
    <Modal onClose={toggle}>
      <Modal.Header>
        <Modal.Title>
          <Icon
            name="attachment"
            size="1.25rem"
            css={css`
              margin-right: 0.5rem;
            `}
          />{' '}
          File Upload
        </Modal.Title>
        <Modal.Close onClick={toggle} />
      </Modal.Header>
      <Modal.Content>
        <Box css={styles.modalContent}>
          <Box
            css={css`
              text-align: center;
              margin-top: 1rem;
            `}
          >
            <CheckPreviewType data={data} />
          </Box>
          <Box
            css={css`
              margin: 30px;
            `}
          >
            <Box css={styles.inputContainer}>
              <Box
                is="span"
                css={css`
                  font-weight: 550;
                `}
              >
                File name
              </Box>
              <Input
                onChange={(e) => {
                  handleFileName(e);
                }}
                value={fileName}
                css={styles.input}
                placeholder="name"
              />
            </Box>

            <Box css={styles.inputContainer}>
              <Box
                is="span"
                css={css`
                  font-weight: 550;
                `}
              >
                File description
              </Box>
              <Input
                onChange={(e) => {
                  handleFileDescription(e);
                }}
                value={fileDescription}
                css={styles.input}
                placeholder="Description"
              />
            </Box>
          </Box>
        </Box>
      </Modal.Content>

      <Modal.Footer
        css={css`
          margin-top: 1.5rem;
        `}
      >
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          css={styles.submitBtn}
          disabled={isPending}
          onClick={() => {
            submit();
          }}
        >
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentPreview;
