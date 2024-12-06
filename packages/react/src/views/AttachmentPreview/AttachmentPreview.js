import React, { useContext, useState, useRef } from 'react';
import { css } from '@emotion/react';
import { Box, Icon, Button, Input, Modal } from '@embeddedchat/ui-elements';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import CheckPreviewType from './CheckPreviewType';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useMemberStore } from '../../store';
import getAttachmentPreviewStyles from './AttachmentPreview.styles';
import { parseEmoji } from '../../lib/emoji';
import MembersList from '../Mentions/MembersList';
import TypingUsers from '../TypingUsers/TypingUsers';
import useSearchMentionUser from '../../hooks/useSearchMentionUser';

const AttachmentPreview = () => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const styles = getAttachmentPreviewStyles();

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const data = useAttachmentWindowStore((state) => state.data);
  const setData = useAttachmentWindowStore((state) => state.setData);
  const [isPending, setIsPending] = useState(false);
  const messageRef = useRef(null);
  const [showMembersList, setShowMembersList] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [startReadMentionUser, setStartReadMentionUser] = useState(false);

  const [fileName, setFileName] = useState(data?.name);

  const threadId = useMessageStore((state) => state.threadMainMessage?._id);
  const handleFileName = (e) => {
    setFileName(e.target.value);
  };

  const { members } = useMemberStore((state) => ({
    members: state.members,
  }));

  const searchMentionUser = useSearchMentionUser(
    members,
    startReadMentionUser,
    setStartReadMentionUser,
    setFilteredMembers,
    setMentionIndex,
    setShowMembersList
  );

  const handleFileDescription = (e) => {
    const description = e.target.value;
    messageRef.current.value = parseEmoji(description);
    searchMentionUser(description);
  };

  const submit = async () => {
    setIsPending(true);
    await RCInstance.sendAttachment(
      data,
      fileName,
      messageRef.current.value,
      ECOptions?.enableThreads ? threadId : undefined
    );
    toggle();
    setData(null);
    if(isPending) {
      setIsPending(false);
    }
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
              <TypingUsers />
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
              {showMembersList && (
                <MembersList
                  messageRef={messageRef}
                  mentionIndex={mentionIndex}
                  setMentionIndex={setMentionIndex}
                  filteredMembers={filteredMembers}
                  setFilteredMembers={setFilteredMembers}
                  setStartReadMentionUser={setStartReadMentionUser}
                  setShowMembersList={setShowMembersList}
                />
              )}
              <Input
                onChange={(e) => {
                  handleFileDescription(e);
                }}
                css={styles.input}
                placeholder="Description"
                ref={messageRef}
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
