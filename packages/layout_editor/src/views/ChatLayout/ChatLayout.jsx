import React from 'react';
import { Box } from '@embeddedchat/ui-elements';
import ChatBody from '../Chatbody/ChatBody';
import ChatInput from '../ChatInput/ChatInput';
import styles from './ChatLayout.styles';

const ChatLayout = () => (
  <Box css={styles.layout} className="ec-chat-layout">
    <Box css={styles.chatMain}>
      <ChatBody />
      <ChatInput />
      <div id="emoji-popup" />
    </Box>

    <Box className="ec-sidebar-view">
      {/* {showMembers && <RoomMembers members={members} />}
      )} */}
    </Box>
  </Box>
);

export default ChatLayout;
