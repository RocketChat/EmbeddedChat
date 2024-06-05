import React, { useState, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import { css } from '@emotion/react';
import { usePinnedMessageStore, useMessageStore } from '../../store';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';
import { Throbber } from '../../components/Throbber';
import Sidebar from '../../components/Sidebar/Sidebar';
import usePinnedMessageStyles from './PinnedMessages.styles';

const PinnedMessages = () => {
  const styles = usePinnedMessageStyles();
  const setShowPinned = usePinnedMessageStore((state) => state.setShowPinned);
  const messages = useMessageStore((state) => state.messages);
  const [loading, setLoading] = useState(true);
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    setLoading(true);
    const filtered = messages.filter(
      (message) => 'pinned' in message && message.pinned === true
    );
    setMessageList(filtered);
    setLoading(false);
  }, [messages]);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Sidebar
      title="Pinned Messages"
      iconName="pin"
      setShowWindow={setShowPinned}
    >
      {loading ? (
        <Box css={styles.centeredColumnStyles}>
          <Throbber />
        </Box>
      ) : (
        <Box css={styles.pinnedListContainer(messageList)}>
          {messageList?.length === 0 ? (
            <Box css={styles.centeredColumnStyles}>
              <Icon
                name="pin"
                size="3rem"
                css={css`
                  padding: 0.5rem;
                `}
              />
              <Box
                is="span"
                css={css`
                  font-size: 1.2rem;
                  font-weight: bold;
                `}
              >
                No pinned messages
              </Box>
            </Box>
          ) : (
            messageList?.map((msg, index, arr) => {
              const newDay =
                index === 0 || isMessageNewDay(msg, arr[index - 1]);
              return (
                <Box key={msg._id}>
                  {newDay && (
                    <Box
                      css={css`
                        padding-top: 0.5rem;
                      `}
                    >
                      <MessageDivider>
                        {format(new Date(msg.ts), 'MMMM d, yyyy')}
                      </MessageDivider>
                    </Box>
                  )}
                  <Message
                    key={msg._id}
                    message={msg}
                    newDay={false}
                    type="default"
                    showAvatar
                    showToolbox={false}
                    showRoles={false}
                    isInSidebar
                    style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                  />
                </Box>
              );
            })
          )}
        </Box>
      )}
    </Sidebar>
  );
};
export default PinnedMessages;
