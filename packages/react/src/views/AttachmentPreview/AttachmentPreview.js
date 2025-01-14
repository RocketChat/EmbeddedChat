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
import getAttachmentPreviewStyles from './AttachmentPreview.styles';
import { parseEmoji } from '../../lib/emoji';
import MembersList from '../Mentions/MembersList';
import useSearchMentionUser from '../../hooks/useSearchMentionUser';

const AttachmentPreview = () => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const styles = getAttachmentPreviewStyles();
  const { theme } = useTheme();

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
    if (isPending) {
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
              display: flex;
              justify-content: center;
              padding: 0 50px 0 50px;
            `}
          >
            <CheckPreviewType data={data} />
          </Box>
          <Box
            css={css`
              margin: 10px;
            `}
          >
            <Box css={styles.inputContainer}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                htmlFor="file-name"
                css={css`
                  font-weight: 550;
                  margin-bottom: 0.5rem;
                  font-size: 0.8rem;
                `}
              >
                File name
              </label>
              <Input
                onChange={(e) => {
                  handleFileName(e);
                }}
                value={fileName}
                id="file-name"
                css={css`
                  ${styles.input}
                  &: focus {
                    ${fileName === ''
                      ? `border: 1px solid red;`
                      : `border: 1px solid #000;`}
                    transition: border 0.1s ease-in;
                  }
                `}
              />
              {fileName === '' && (
                <Box
                  css={css`
                    color: red;
                    margin-top: 0.5rem;
                    font-size: 0.65rem;
                  `}
                >
                  The field File name is required.
                </Box>
              )}
            </Box>

            <Box css={styles.inputContainer}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                htmlFor="file-description"
                css={css`
                  font-weight: 550;
                  margin-bottom: 0.5rem;
                  font-size: 0.8rem;
                `}
              >
                File description
              </label>
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
                    ${styles.input}
                    &:focus {
                      border: 1.2px solid ${theme.colors.ring};
                      transition: border 0.9s ease-in, border 0.9s ease-out;
                    }
                  `}
                  id="file-description"
                  ref={messageRef}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal.Content>

      <Modal.Footer
        css={css`
          margin-bottom: 1rem;
          padding-right: 1rem;
        `}
      >
        <Button type="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          disabled={isPending || fileName === ''}
          onClick={() => {
            if (fileName !== '') {
              submit();
            }
          }}
        >
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentPreview;
