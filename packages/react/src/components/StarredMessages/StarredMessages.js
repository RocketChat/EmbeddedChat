import React, { useState, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import {
  useStarredMessageStore,
  useMessageStore,
  useUserStore,
} from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';
import { Throbber } from '../Throbber';
import Sidebar from '../Sidebar/Sidebar';

const StarredMessages = () => {
  const setShowStarred = useStarredMessageStore(
    (state) => state.setShowStarred
  );
  const authenticatedUserId = useUserStore((state) => state.userId);
  const messages = useMessageStore((state) => state.messages);
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filtered = messages.filter(
      (message) =>
        'starred' in message &&
        message.starred.find((msg) => msg._id === authenticatedUserId)
    );
    setMessageList(filtered);
    setLoading(false);
  }, [messages]);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Sidebar
      title="Starred Messages"
      iconName="star"
      setShowWindow={setShowStarred}
    >
      {loading ? (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#4a4a4a',
          }}
        >
          <Throbber />
        </Box>
      ) : (
        <Box
          style={{
            flex: '1',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messageList?.length === 0 ? 'center' : 'initial',
            alignItems: messageList?.length === 0 ? 'center' : 'initial',
            overflowX: 'hidden',
            maxWidth: '100%',
          }}
        >
          {messageList?.length === 0 ? (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#4a4a4a',
              }}
            >
              <Icon name="star" size="3rem" style={{ padding: '0.5rem' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                No starred messages
              </span>
            </Box>
          ) : (
            messageList?.map((msg, index, arr) => {
              const newDay =
                index === 0 || isMessageNewDay(msg, arr[index - 1]);
              return (
                <Box key={msg._id}>
                  {newDay && (
                    <Box style={{ paddingTop: '0.5rem' }}>
                      <MessageDivider>
                        {format(new Date(msg.ts), 'MMMM d, yyyy')}
                      </MessageDivider>
                    </Box>
                  )}
                  <Message
                    key={msg._id}
                    message={msg}
                    newDay={false}
                    variant="default"
                    showAvatar
                    showToolbox={false}
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

export default StarredMessages;
