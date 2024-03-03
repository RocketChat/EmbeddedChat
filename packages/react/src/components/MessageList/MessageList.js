import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';
import {
  useMessageStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
  useUserStore,
  useMentionsStore,
  useThreadsMessageStore,
} from '../../store';
import RoomMembers from '../RoomMembers/RoomMember';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import SearchMessage from '../SearchMessage/SearchMessage';
import Roominfo from '../RoomInformation/RoomInformation';
import AllThreads from '../AllThreads/AllThreads';
import UserMentions from '../UserMentions/UserMentions';
import { Message } from '../Message';

const MessageList = ({ messages }) => {
  const showSearch = useSearchMessageStore((state) => state.showSearch);
  const showChannelinfo = useChannelStore((state) => state.showChannelinfo);
  const showMembers = useMemberStore((state) => state.showMembers);
  const members = useMemberStore((state) => state.members);
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const showAvatar = useUserStore((state) => state.showAvatar);
  const showAllThreads = useThreadsMessageStore(
    (state) => state.showAllThreads
  );
  const showMentions = useMentionsStore((state) => state.showMentions);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <>
      {messages &&
        messages.map((msg, index, arr) => {
          const prev = arr[index + 1];
          const newDay = isMessageNewDay(msg, prev);
          const sequential = isMessageSequential(msg, prev, 300);
          return (
            msg && (
              <Message
                key={msg._id}
                message={msg}
                newDay={newDay}
                sequential={sequential}
                variant="default"
                showAvatar={showAvatar}
              />
            )
          );
        })}

      {showMembers && <RoomMembers members={members} />}
      {showReportMessage && <MessageReportWindow messageId={messageToReport} />}
      {showSearch && <SearchMessage />}
      {showChannelinfo && <Roominfo />}
      {showAllThreads && <AllThreads />}
      {showMentions && <UserMentions />}
    </>
  );
};

export default MessageList;

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
};
