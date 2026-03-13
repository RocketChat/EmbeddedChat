import React, { useContext, useState, useRef, useEffect } from 'react';
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

  const [fileName, setFileName] = useState(data?.name ?? '');
  useEffect(() => setFileName(data?.name ?? ''), [data?.name]);

  const [description, setDescription] = useState('');
  const charCount = description.length;
  const msgMaxLength = useSettingsStore((s) => s?.messageLimit);
  const isOverLimit = msgMaxLength && charCount > msgMaxLength;

  const threadId = useMessageStore((state) => state.threadMainMessage?._id);
  const { members } = useMemberStore((state) => ({ members: state.members }));

  const searchMentionUser = useSearchMentionUser(
    members,
    startReadMentionUser,
    setStartReadMentionUser,
    setFilteredMembers,
    setMentionIndex,
    setShowMembersList
  );

  const handleFileName = (e) => setFileName(e.target.value);

  const handleFileDescription = (e) => {
    const raw = e.target.value || '';
    setDescription(raw);

    if (messageRef.current && typeof messageRef.current.value !== 'undefined') {
      messageRef.current.value = raw;
    }

    searchMentionUser(raw);
  };

  const submit = async () => {
    if (isPending) return;
    if (msgMaxLength && description.length > msgMaxLength) return;

    setIsPending(true);
    try {
      await RCInstance.sendAttachment(
        data,
        fileName,
        parseEmoji(description),
        ECOptions?.enableThreads ? threadId : undefined
      );
      toggle();
      setData(null);
    } finally {
      setIsPending(false);
    }
  };

  const onDescKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
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
          />
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
                onChange={handleFileName}
                value={fileName}
                type="text"
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
                    />
                  )}
                </Box>

                <Input
                  onChange={handleFileDescription}
                  onKeyDown={onDescKeyDown}
                  type="text"
                  placeholder="Description"
                  ref={messageRef}
                  value={description}
                  css={css`
                    ${styles.input};
                    border-color: ${isOverLimit
                      ? theme.colors.destructive
                      : null};
                    color: ${isOverLimit ? theme.colors.destructive : null};
                  `}
                />

                {msgMaxLength && (
                  <Box
                    css={css`
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-top: 6px;
                      gap: 12px;
                      font-size: 0.875rem;
                    `}
                  >
                    <Box
                      css={css`
                        color: ${isOverLimit
                          ? theme.colors.destructive
                          : 'transparent'};
                        font-weight: 500;
                        text-align: left;
                        flex: 1 1 auto;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      `}
                      aria-hidden={!isOverLimit}
                      role={isOverLimit ? 'alert' : undefined}
                    >
                      {isOverLimit
                        ? `Cannot upload file, description is over the ${msgMaxLength} character limit`
                        : ''}
                    </Box>

                    <Box
                      css={css`
                        color: ${isOverLimit
                          ? theme.colors.destructive
                          : '#6b7280'};
                        min-width: 68px;
                        text-align: right;
                        flex: 0 0 auto;
                      `}
                      aria-hidden="true"
                    >
                      ({charCount}/{msgMaxLength})
                    </Box>
                  </Box>
                )}
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

        <Button disabled={isPending || isOverLimit} onClick={submit}>
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentPreview;
