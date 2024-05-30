import React, { useState, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import { css } from '@emotion/react';
import {
  useStarredMessageStore,
  useMessageStore,
  useUserStore,
} from '../../store';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';
import { Throbber } from '../../components/Throbber';
import Sidebar from '../../components/Sidebar/Sidebar';
import useStarredMessageStyles from './StarredMessages.styles';

const StarredMessages = () => {
  const styles = useStarredMessageStyles();
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
        message.starred.some((msg) => msg._id === authenticatedUserId)
    );
    setMessageList(filtered);
    setLoading(false);
  }, [authenticatedUserId, messages]);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Sidebar
      title="Starred Messages"
      iconName="star"
      setShowWindow={setShowStarred}
    >
      {loading ? (
        <Box css={styles.centeredColumnStyles}>
          <Throbber />
        </Box>
      ) : (
        <Box css={styles.starredListContainer(messageList)}>
          {messageList?.length === 0 ? (
            <Box css={styles.centeredColumnStyles}>
              <Icon
                name="star"
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
                No starred messages
              </Box>
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
                    type="default"
                    showAvatar
                    showToolbox={false}
                    showRoles={false}
                    isLinkPreview={false}
                    style={{ paddingRight: '1.25rem', paddingLeft: '1.25rem' }}
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
