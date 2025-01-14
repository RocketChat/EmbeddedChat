import React, { useContext, useState, useRef } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  Button,
  Input,
  Modal,
  useTheme,
} from '@embeddedchat/ui-elements';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import CheckPreviewType from './CheckPreviewType';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useMemberStore } from '../../store';
import useSettingsStore from '../../store/settingsStore';
import getAttachmentPreviewStyles from './AttachmentPreview.styles';
import { parseEmoji } from '../../lib/emoji';
import MembersList from '../Mentions/MembersList';
import TypingUsers from '../TypingUsers/TypingUsers';
import useSearchMentionUser from '../../hooks/useSearchMentionUser';

const AttachmentPreview = () => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const { theme } = useTheme();
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
  const [isMsgLong, setIsMsgLong] = useState(false);

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
    if (isPending) {
      setIsPending(false);
    }
  };

  const msgMaxLength = useSettingsStore((state) => state.messageLimit);
  const descAboveMaxLengthMsg = `Cannot upload file, description is over the ${msgMaxLength} character limit`;

  const checkIfMsgLong = (description) => {
    if (description.length > msgMaxLength) {
      setIsMsgLong(true);
      return;
    }
    submit();
  };

  const handleFileDescription = (e) => {
    const description = e.target.value;
    messageRef.current.value = parseEmoji(description);
    if (isMsgLong) {
      if (description.length <= msgMaxLength) {
        setIsMsgLong(false);
      }
    }
    searchMentionUser(description);
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
              <Box css={styles.fileDescription}>
                <Box css={styles.mentionListContainer}>
                  {showMembersList && (
                    <MembersList
                      messageRef={messageRef}
                      mentionIndex={mentionIndex}
                      setMentionIndex={setMentionIndex}
                      filteredMembers={filteredMembers}
                      setFilteredMembers={setFilteredMembers}
                      setStartReadMentionUser={setStartReadMentionUser}
                      setShowMembersList={setShowMembersList}
                      css={css`
                        width: auto;
                      `}
                    />
                  )}
                </Box>
                <Input
                  onChange={(e) => {
                    handleFileDescription(e);
                  }}
                  css={css`
                    ${styles.input};
                    border-color: ${isMsgLong
                      ? theme.colors.destructive
                      : null};
                    color: ${isMsgLong ? theme.colors.destructive : null};
                  `}
                  placeholder="Description"
                  ref={messageRef}
                />
                <Box>
                  {isMsgLong && (
                    <Box
                      css={css`
                        color: ${theme.colors.destructive};
                        font-size: 12px;
                        margin-top: 5px;
                      `}
                    >
                      {descAboveMaxLengthMsg}
                    </Box>
                  )}
                </Box>
              </Box>
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
            checkIfMsgLong(messageRef.current.value);
          }}
        >
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentPreview;
