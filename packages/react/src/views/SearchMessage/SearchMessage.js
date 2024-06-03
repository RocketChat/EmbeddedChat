import React, { useState, useContext, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import { debounce } from 'lodash';
import RCContext from '../../context/RCInstance';
import { useSearchMessageStore } from '../../store';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './SearchMessage.styles';

const Search = () => {
  const { RCInstance } = useContext(RCContext);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);

  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchMessages = async () => {
    const { messages } = await RCInstance.getSearchMessages(text);
    setMessageList(messages);
  };

  const debouncedSearch = debounce(async () => {
    await searchMessages();
  }, 500); // 500ms delay

  useEffect(() => {
    if (!text.trim()) {
      if (messageList.length > 0) {
        setMessageList([]);
      }
    } else {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [text, debouncedSearch, messageList.length]);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Sidebar
      title="Search Messages"
      iconName="magnifier"
      setShowWindow={setShowSearch}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: 'Search Messages',
      }}
    >
      <Box css={styles.searchListContainer(messageList)}>
        {messageList.length === 0 ? (
          <Box css={styles.centeredColumnStyles}>
            <Icon name="magnifier" size="3rem" style={{ padding: '0.5rem' }} />
            <Box is="span" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              No results found
            </Box>
          </Box>
        ) : (
          messageList.map((msg, index, arr) => {
            const newDay = index === 0 || isMessageNewDay(msg, arr[index - 1]);
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
                  sequential={false}
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
    </Sidebar>
  );
};
export default Search;
