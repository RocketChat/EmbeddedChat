import React, { useState, useMemo } from 'react';
import { css } from '@emotion/react';
import classes from './AllThreads.module.css';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
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

const MessageCss = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 0.5rem;
  -webkit-padding-before: 0.5rem;
  padding-block-start: 0.5rem;
  padding-bottom: 0.25rem;
  -webkit-padding-after: 0.25rem;
  padding-block-end: 0.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-inline: 1.25rem;
  cursor: pointer;
  &:hover {
    background: #f2f3f5;
  }
`;

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

  return (
    <Box className={classes.component}>
      <Box className={classes.wrapContainer}>
        <Box style={{ padding: '16px' }}>
          <Box
            css={css`
              display: flex;
            `}
          >
            <h3 style={{ display: 'contents' }}>
              <Icon
                name="thread"
                size="1.25rem"
                style={{ padding: '0px 20px 20px 0px' }}
              />
              <Box
                css={css`
                  width: 100%;
                  color: #4a4a4a;
                `}
              >
                Threads
              </Box>
              <ActionButton onClick={toggleShowAllThreads} ghost size="small">
                <Icon name="cross" size="1.25rem" />
              </ActionButton>
            </h3>
          </Box>

          <Box
            className={classes.searchContainer}
            style={{ border: '2px solid #ddd', position: 'relative' }}
          >
            <input
              placeholder="Search Messages"
              onChange={handleInputChange}
              className={classes.textInput}
            />

            <Icon
              name="magnifier"
              size="1.25rem"
              style={{ padding: '0.125em', cursor: 'pointer' }}
            />
          </Box>
        </Box>

        <Box
          style={{
            flex: '1',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: filteredThreads.length === 0 ? 'center' : 'initial',
            alignItems: filteredThreads.length === 0 ? 'center' : 'initial',
          }}
        >
          {filteredThreads.length === 0 ? (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#4a4a4a',
              }}
            >
              <Icon
                name="magnifier"
                size="3rem"
                style={{ padding: '0.5rem' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                No threads found
              </span>
            </Box>
          ) : (
            filteredThreads.map(
              (message) =>
                !message.t &&
                message.tcount && (
                  <Box
                    key={message._id}
                    css={MessageCss}
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
      </Box>
    </Box>
  );
};

export default AllThreads;
