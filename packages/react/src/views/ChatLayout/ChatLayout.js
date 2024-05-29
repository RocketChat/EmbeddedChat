import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import styles from './ChatLayout.styles';
import {
  useChannelStore,
  useUserStore,
  usePinnedMessageStore,
  useStarredMessageStore,
  useSearchMessageStore,
  useFileStore,
  useMentionsStore,
  useThreadsMessageStore,
  useMemberStore,
} from '../../store';

import RoomMembers from '../RoomMembers/RoomMember';
import UserMentions from '../UserMentions/UserMentions';
import AllThreads from '../AllThreads/AllThreads';
import PinnedMessages from '../PinnedMessages/PinnedMessages';
import StarredMessages from '../StarredMessages/StarredMessages';
import SearchMessage from '../SearchMessage/SearchMessage';
import Roominfo from '../RoomInformation/RoomInformation';
import { Files } from '../Files';
import UserInformation from '../UserInformation/UserInformation';
import ChatBody from '../ChatBody/ChatBody';
import ChatInput from '../ChatInput/ChatInput';

const ChatLayout = ({
  anonymousMode,
  showRoles,
  messageListRef,
  scrollToBottom,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChatBody');
  const showMentions = useMentionsStore((state) => state.showMentions);
  const showAllFiles = useFileStore((state) => state.showAllFiles);
  const showAllThreads = useThreadsMessageStore(
    (state) => state.showAllThreads
  );
  const showPinned = usePinnedMessageStore((state) => state.showPinned);
  const showStarred = useStarredMessageStore((state) => state.showStarred);
  const showSearch = useSearchMessageStore((state) => state.showSearch);
  const showChannelinfo = useChannelStore((state) => state.showChannelinfo);
  const showMembers = useMemberStore((state) => state.showMembers);
  const members = useMemberStore((state) => state.members);
  const showCurrentUserInfo = useUserStore(
    (state) => state.showCurrentUserInfo
  );

  return (
    <Box
      css={styles.layout}
      style={{
        ...styleOverrides,
      }}
      className={`ec-chat-layout ${classNames}`}
    >
      <Box css={styles.chatMain}>
        <ChatBody
          anonymousMode={anonymousMode}
          showRoles={showRoles}
          messageListRef={messageListRef}
          scrollToBottom={scrollToBottom}
        />
        <ChatInput scrollToBottom={scrollToBottom} />
        <div id="popup" />
      </Box>

      <Box>
        {showMembers && <RoomMembers members={members} />}
        {showSearch && <SearchMessage />}
        {showChannelinfo && <Roominfo />}
        {showAllThreads && <AllThreads />}
        {showAllFiles && <Files />}
        {showMentions && <UserMentions />}
        {showPinned && <PinnedMessages />}
        {showStarred && <StarredMessages />}
        {showCurrentUserInfo && <UserInformation />}
      </Box>
    </Box>
  );
};

ChatLayout.propTypes = {
  anonymousMode: PropTypes.bool,
  showRoles: PropTypes.bool,
};

export default ChatLayout;
