import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Icon,
  ActionButton,
  Button,
  InputBox,
  CheckBox,
  Label,
} from '@rocket.chat/fuselage';
import RCContext from '../../context/RCInstance';
import classes from './PruneMessage.module.css';
import {
  usePruneMessageStore,
  useChannelStore,
  useMessageStore,
} from '../../store';
import mentionmemberStore from '../../store/mentionmemberStore';

const Prune = () => {
  const { RCInstance } = useContext(RCContext);
  const togglePrune = usePruneMessageStore((state) => state.toggle);

  const getMessages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  const [newerDate, setNewerDate] = useState(null);
  const [newerTime, setNewerTime] = useState(null);
  const [olderDate, setOlderDate] = useState(null);
  const [olderTime, setOlderTime] = useState(null);

  const [fromDate, setFromDate] = useState(new Date('0001-01-01T00:00:00Z'));
  const [toDate, setToDate] = useState(new Date('9999-12-31T23:59:59Z'));

  const getTimeZoneOffset = () => {
    const offset = new Date().getTimezoneOffset();
    const absOffset = Math.abs(offset);
    return `${offset < 0 ? '+' : '-'}${`00${Math.floor(absOffset / 60)}`.slice(
      -2
    )}:${`00${absOffset % 60}`.slice(-2)}`;
  };

  useEffect(() => {
    if (newerDate || newerTime) {
      setFromDate(
        new Date(
          `${newerDate}T${newerTime || '00:00'}:00${getTimeZoneOffset()}`
        )
      );
    }

    if (olderDate || olderTime) {
      setToDate(
        new Date(
          `${olderDate}T${olderTime || '24:00'}:00${getTimeZoneOffset()}`
        )
      );
    }
  }, [newerDate, newerTime, olderDate, olderTime]);

  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState(null);
  const [inclusive, setInclusive] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(false);
  const [discussionMessage, setDiscussionMessage] = useState(false);
  const [thread, setThread] = useState(false);
  const [onlyAttachedFiles, setOnlyAttachedFiles] = useState(false);

  const rid = useChannelStore((state) => state.channelInfo)._id;

  const getRoomMembers = mentionmemberStore((state) => state.roomMembers).map(
    (i) => i.username
  );

  const toggleShowPrune = () => {
    togglePrune();
  };

  const handlePrune = async () => {
    const d = getMessages.filter((i) => {
      const md = new Date(i.ts);
      const fd = fromDate;
      const td = toDate;
      return !(fd < md && md < td);
    });
    const data = {
      roomId: rid,
      latest: toDate.toISOString(),
      oldest: fromDate.toISOString(),
      inclusive,
      excludePinned: pinnedMessage,
      filesOnly: onlyAttachedFiles,
      users: userList,
      ignoreDiscussion: discussionMessage,
      ignoreThreads: thread,
    };
    const res = await RCInstance.cleanHistory(data);
    setMessages(d);
    togglePrune();
  };

  return (
    <Box className={classes.searchBar} p="x16">
      <Box display="flex" is="h3">
        <Icon name="eraser" size="x24" padding="0px 20px 20px 0px" />
        <Box
          width="80%"
          style={{
            color: '#4a4a4a',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          Prune Messages
        </Box>
        <ActionButton
          onClick={toggleShowPrune}
          ghost
          display="inline"
          square
          small
        >
          <Icon name="cross" size="x20" />
        </ActionButton>
      </Box>
      <Box style={{ marginTop: '10px' }}>
        <div
          style={{ fontSize: 'x-small', color: '#4a4a4a', fontWeight: '600' }}
        >
          Newer than
        </div>
        <Box style={{ marginTop: '5px' }}>
          <InputBox
            style={{ margin: '2px' }}
            type="date"
            onChange={(e) => setNewerDate(e.target.value)}
            flexGrow={1}
            h="x20"
          />
          <InputBox
            type="time"
            onChange={(e) => setNewerTime(e.target.value)}
            flexGrow={1}
            h="x20"
          />
        </Box>
      </Box>

      <Box style={{ marginTop: '15px' }}>
        <div
          style={{ fontSize: 'x-small', color: '#4a4a4a', fontWeight: '600' }}
        >
          Older than
        </div>
        <Box style={{ marginTop: '5px' }}>
          <InputBox
            type="date"
            onChange={(e) => setOlderDate(e.target.value)}
            flexGrow={1}
            h="x20"
          />
          <InputBox
            style={{ margin: '2px' }}
            type="time"
            onChange={(e) => setOlderTime(e.target.value)}
            flexGrow={1}
            h="x20"
          />
        </Box>
      </Box>
      <Box style={{ marginTop: '15px' }}>
        <div
          style={{ fontSize: 'x-small', color: '#4a4a4a', fontWeight: '600' }}
        >
          Only prune content from these users (leave empty to prune everyone
          &#39; s content)
        </div>
        <Box
          style={{ marginTop: '5px' }}
          className={classes.container}
          border="2px solid #ddd"
        >
          <Icon name="magnifier" size="x24" padding={6} />
          <input
            placeholder=""
            onChange={(e) => setUsername(e.target.value)}
            className={classes.textInput}
          />
        </Box>
        {getRoomMembers.filter((i) => i.includes(username)).length > 0 ? (
          <Box
            style={{
              border: '2px solid #ddd',
              marginTop: '10px',
            }}
          >
            {getRoomMembers
              .filter((i) => i.includes(username))
              .map((i, idx) => (
                <div
                  aria-hidden="true"
                  onClick={() => {
                    setUserList([...userList, i]);
                    setUsername(null);
                  }}
                  className={classes.selectUser}
                  key={idx}
                >
                  @{i}
                </div>
              ))}
          </Box>
        ) : null}
        <Box style={{ marginTop: '25px' }}>
          <Box className={classes.checkBox}>
            <CheckBox
              onChange={() => {
                setInclusive(!inclusive);
              }}
            />
            <Label className={classes.label_checkbox}>Inclusive</Label>
          </Box>
          <Box className={classes.checkBox}>
            <CheckBox
              onChange={() => {
                setPinnedMessage(!pinnedMessage);
              }}
            />
            <Label className={classes.label_checkbox}>
              Do not prune pinned messages
            </Label>
          </Box>
          <Box className={classes.checkBox}>
            <CheckBox
              onChange={() => {
                setDiscussionMessage(!discussionMessage);
              }}
            />
            <Label className={classes.label_checkbox}>
              Do not prune discussion messages
            </Label>
          </Box>
          <Box className={classes.checkBox}>
            <CheckBox
              onChange={() => {
                setThread(!thread);
              }}
            />
            <Label className={classes.label_checkbox}>
              Do not prune Threads
            </Label>
          </Box>
          <Box className={classes.checkBox}>
            <CheckBox
              onChange={() => {
                setOnlyAttachedFiles(!onlyAttachedFiles);
              }}
            />
            <Label className={classes.label_checkbox}>
              Only remove the attached files, keep messages
            </Label>
          </Box>
        </Box>
      </Box>
      <Button style={{ width: '100%' }} onClick={handlePrune} danger>
        Prune
      </Button>
    </Box>
  );
};
export default Prune;
