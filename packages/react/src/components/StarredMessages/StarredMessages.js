import React, { useState, useContext, useMemo, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import RCContext from '../../context/RCInstance';
import classes from './StarredMessages.module.css';
import { useStarredMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';
import isMessageSequential from '../../lib/isMessageSequential';
import { Throbber } from '../Throbber';

const StarredMessages = () => {
  const { RCInstance } = useContext(RCContext);
  const setShowStarred = useStarredMessageStore(
    (state) => state.setShowStarred
  );

  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleShowStarred = () => {
    setShowStarred(false);
  };

  const getStarredMessages = async () => {
    const { messages } = await RCInstance.getStarredMessages();
    setMessageList(messages);
    setLoading(false);
  };

  useEffect(() => {
    if (messageList.length === 0) {
      getStarredMessages();
    }
  }, [messageList, getStarredMessages]);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Box className={classes.sidebar} style={{ padding: '1rem' }}>
      <Box className={classes.wrapContainer}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ display: 'contents' }}>
            <Icon name="star" size="1.25rem" />
            <Box style={{ color: '#4a4a4a', width: '80%' }}>
              Starred Messages
            </Box>
            <ActionButton onClick={toggleShowStarred} ghost size="small">
              <Icon name="cross" size="x20" />
            </ActionButton>
          </h3>
        </Box>
        <Box
          style={{
            flex: '1',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messageList.length === 0 ? 'center' : 'initial',
            alignItems: messageList.length === 0 ? 'center' : 'initial',
          }}
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
          ) : messageList.length === 0 ? (
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
            messageList.map((msg, index, arr) => {
              const prev = arr[index + 1];
              const newDay = isMessageNewDay(msg, prev);
              const sequential = isMessageSequential(msg, prev, 300);
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
                    sequential={sequential}
                    variant="default"
                    showAvatar
                    showToolbox={false}
                  />
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default StarredMessages;
