import React, { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import { Icon } from '../../components/Icon';
import { Box } from '../../components/Box';
import {
  useMessageStore,
  useUserStore,
  useThreadsMessageStore,
} from '../../store';
import { MessageBody } from '../Message/MessageBody';
import { MessageMetrics } from '../Message/MessageMetrics';
import MessageAvatarContainer from '../Message/MessageAvatarContainer';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import MessageHeader from '../Message/MessageHeader';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './AllThreads.styles';

const AllThreads = () => {
  const showAvatar = useUserStore((state) => state.showAvatar);
  const messages = useMessageStore((state) => state.messages);
  const setShowAllThreads = useThreadsMessageStore(
    (state) => state.setShowAllThreads
  );
  const openThread = useMessageStore((state) => state.openThread);
  const [text, setText] = useState('');

  const toggleShowAllThreads = () => {
    setShowAllThreads(false);
  };

  const handleOpenThread = (msg) => () => {
    openThread(msg);
    toggleShowAllThreads(false);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const filteredThreads = useMemo(
    () =>
      messages.filter((message) =>
        message.msg.toLowerCase().includes(text.toLowerCase())
      ),
    [messages, text]
  );

  const containsThreads = messages.some(
    (message) => !message.t && message.tcount > 0
  );

  return (
    <Sidebar
      title="Threads"
      iconName="thread"
      setShowWindow={setShowAllThreads}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: 'Search Threads',
      }}
    >
      <Box css={styles.threadListContainer(containsThreads, filteredThreads)}>
        {!containsThreads || filteredThreads.length === 0 ? (
          <Box css={styles.centeredColumnStyles}>
            <Icon
              name="magnifier"
              size="3rem"
              css={css`
                padding: 0.5rem;
              `}
            />
            <Box
              is="span"
              css={css`
                fontsize: 1.2rem;
                font-weight: bold;
              `}
            >
              No threads found
            </Box>
          </Box>
        ) : (
          filteredThreads.map(
            (message) =>
              !message.t &&
              message.tcount && (
                <Box
                  key={message._id}
                  css={styles.threadMessageContainer}
                  onClick={handleOpenThread(message)}
                >
                  {showAvatar && (
                    <MessageAvatarContainer
                      message={message}
                      sequential={false}
                      isStarred={false}
                    />
                  )}
                  <MessageBodyContainer>
                    <MessageHeader message={message} isTimeStamped={false} />

                    <MessageBody>
                      {message.attachments && message.attachments.length > 0
                        ? message.file.name
                        : message.msg}
                    </MessageBody>

                    <MessageMetrics message={message} isReplyButton={false} />
                  </MessageBodyContainer>
                </Box>
              )
          )
        )}
      </Box>
    </Sidebar>
  );
};

export default AllThreads;
