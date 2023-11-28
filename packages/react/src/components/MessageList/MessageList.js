import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';
import {
  useMessageStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
  useUserStore,
} from '../../store';
import RoomMembers from '../RoomMembers/RoomMember';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import SearchMessage from '../SearchMessage/SearchMessage';
import Roominfo from '../RoomInformation/RoomInformation';
import { Message } from '../Message';
import { Button } from '../Button';
import { Box } from '../Box';
import { Icon } from '../Icon';

const MessageList = ({ messages, handleGoBack }) => {
  const showSearch = useSearchMessageStore((state) => state.showSearch);
  const showChannelinfo = useChannelStore((state) => state.showChannelinfo);
  const filtered = useMessageStore((state) => state.filtered);
  const showMembers = useMemberStore((state) => state.showMembers);
  const members = useMemberStore((state) => state.members);
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const showAvatar = useUserStore((state) => state.showAvatar);

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
      {filtered && (
        <Box>
          <Button size="small" onClick={handleGoBack}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="back"
              size="1.25rem"
              color="error"
            />
            <p style={{ marginBottom: '0.2rem' }}>Go Back</p>
          </Button>
        </Box>
      )}
      {showMembers && <RoomMembers members={members} />}
      {showReportMessage && <MessageReportWindow messageId={messageToReport} />}
      {showSearch && <SearchMessage />}
      {showChannelinfo && <Roominfo />}
    </>
  );
};

export default MessageList;

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
  handleGoBack: PropTypes.func,
};
