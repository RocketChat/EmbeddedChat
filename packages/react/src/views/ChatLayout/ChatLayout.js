import React, { useEffect, useRef, useCallback } from 'react';
import { Box, useComponentOverrides } from '@embeddedchat/ui-elements';
import styles from './ChatLayout.styles';
import {
  useChannelStore,
  useChatDataStore,
  useChatLayoutStore,
  useUserStore,
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
import useDropBox from '../../hooks/useDropBox';
import AttachmentPreview from '../AttachmentPreview/AttachmentPreview';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import CheckPreviewType from '../AttachmentPreview/CheckPreviewType';
import { useRCContext } from '../../context/RCInstance';
import UiKitContextualBar from '../ContextualBarBlock/uiKit/UiKitContextualBar';
import useUiKitStore from '../../store/uiKitStore';
import useFetchChatData from '../../hooks/useFetchChatData';

const ChatLayout = () => {
  const messageListRef = useRef(null);
  const clearUnreadDividerRef = useRef(null);
  const { classNames, styleOverrides } = useComponentOverrides('ChatBody');
  const { RCInstance, ECOptions } = useRCContext();
  const anonymousMode = ECOptions?.anonymousMode;
  const showRoles = ECOptions?.showRoles;
  const setStarredMessages = useChatDataStore((state) => state.setStarredMessages);
  const { getStarredMessages } = useFetchChatData(showRoles);
  const showSidebar = useChatLayoutStore((state) => state.showSidebar);
  const showMentions = useChatLayoutStore((state) => state.showMentions);
  const showAllFiles = useChatLayoutStore((state) => state.showAllFiles);
  const showAllThreads = useChatLayoutStore((state) => state.showAllThreads);
  const showPinned = useChatLayoutStore((state) => state.showPinned);
  const showStarred = useChatLayoutStore((state) => state.showStarred);
  const showSearch = useChatLayoutStore((state) => state.showSearch);
  const showChannelinfo = useChatLayoutStore((state) => state.showChannelinfo);
  const showMembers = useChatLayoutStore((state) => state.showMembers);
  const members = useMemberStore((state) => state.members);
  const showCurrentUserInfo = useChatLayoutStore(
    (state) => state.showCurrentUserInfo
  );
  const attachmentWindowOpen = useAttachmentWindowStore(
    (state) => state.attachmentWindowOpen
  );
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const { data, handleDrag, handleDragDrop } = useDropBox();
  const { uiKitContextualBarOpen, uiKitContextualBarData } = useUiKitStore(
    (state) => ({
      uiKitContextualBarOpen: state.uiKitContextualBarOpen,
      uiKitContextualBarData: state.uiKitContextualBarData,
    })
  );

  const scrollToBottom = () => {
    if (messageListRef && messageListRef.current) {
      requestAnimationFrame(() => {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      });
    }
  };
  useEffect(() => {
    getStarredMessages(anonymousMode);
  }, [showSidebar, anonymousMode, getStarredMessages]);
  return (
    <Box
      css={styles.layout}
      style={{
        ...styleOverrides,
      }}
      className={`ec-chat-layout ${classNames}`}
      onDragOver={(e) => handleDrag(e)}
      onDrop={(e) => handleDragDrop(e)}
    >
      <Box css={styles.chatMain}>
        <ChatBody
          anonymousMode={anonymousMode}
          showRoles={showRoles}
          messageListRef={messageListRef}
          scrollToBottom={scrollToBottom}
          clearUnreadDividerRef={clearUnreadDividerRef}
        />
        <ChatInput
          scrollToBottom={scrollToBottom}
          clearUnreadDividerRef={clearUnreadDividerRef}
        />
        <div id="emoji-popup" />
      </Box>

      {showSidebar && (
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
          {uiKitContextualBarOpen && (
            <UiKitContextualBar
              key={Math.random()}
              initialView={uiKitContextualBarData}
            />
          )}
        </Box>
      )}

      {attachmentWindowOpen ? (
        data ? (
          <>
            <AttachmentPreview />
          </>
        ) : (
          <CheckPreviewType data={data} />
        )
      ) : null}
    </Box>
  );
};

export default ChatLayout;
