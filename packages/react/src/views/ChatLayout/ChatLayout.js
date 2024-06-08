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
import MentionedMessages from '../MessageAggregators/MentionedMessages';
import ThreadedMessages from '../MessageAggregators/ThreadedMessages';
import StarredMessages from '../MessageAggregators/StarredMessages';
import PinnedMessages from '../MessageAggregators/PinnedMessages';
import SearchMessages from '../MessageAggregators/SearchMessages';
import FileGallery from '../MessageAggregators/FileGallery';
import Roominfo from '../RoomInformation/RoomInformation';
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
        <div id="emoji-popup" />
      </Box>

      <Box className="ec-sidebar-view">
        {showMembers && <RoomMembers members={members} />}
        {showSearch && <SearchMessages />}
        {showChannelinfo && <Roominfo />}
        {showAllThreads && <ThreadedMessages />}
        {showAllFiles && <FileGallery />}
        {showMentions && <MentionedMessages />}
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
