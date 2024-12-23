import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  Button,
  Input,
  Modal,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import CheckPreviewType from './CheckPreviewType';
import RCContext from '../../context/RCInstance';
import { useUserStore, useMessageStore } from '../../store';
import getAttachmentPreviewStyles from './AttachmentPreview.styles';
import { parseEmoji } from '../../lib/emoji';
import { createPendingFileMessage } from '../../lib/createPendingMessage';

const AttachmentPreview = () => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const styles = getAttachmentPreviewStyles();

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
    setFileDescription(parseEmoji(e.target.value));
  };

  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const dispatchToastMessage = useToastBarDispatch();

  const { username, userId, name } = useUserStore((state) => ({
    username: state.username,
    userId: state.userId,
    name: state.name,
  }));
  const userInfo = { _id: userId, username, name };

  const submit = async () => {
    setIsPending(true);

    let pendingFileMessage = createPendingFileMessage(
      data,
      userInfo,
      fileDescription
    );
    upsertMessage(pendingFileMessage, ECOptions.enableThreads);
    toggle();

    if (!navigator.onLine) {
      dispatchToastMessage({
        type: 'error',
        message: 'Please try again after connecting to internet!',
      });
      removeMessage(pendingFileMessage._id);
      return;
    }

    const res = await RCInstance.sendAttachment(
      data,
      fileName,
      fileDescription,
      ECOptions?.enableThreads ? threadId : undefined
    );

    if (res.success) {
      removeMessage(pendingFileMessage._id);
    }

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
                  margin-bottom: 0.5rem;
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
                  margin-bottom: 0.5rem;
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
        <Button type="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
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
