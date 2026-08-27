import { css } from '@emotion/react';
import { useTheme, Box } from '@embeddedchat/ui-elements';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';

export default function TypingUsers({ extraUsers = [] }) {
  const { RCInstance } = useContext(RCContext);
  const currentUserName = useUserStore((state) => state.username);
  const [typingUsers, setTypingUsers] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    RCInstance.addTypingStatusListener((t) => {
      setTypingUsers((t || []).filter((u) => u !== currentUserName));
    });
    return () => RCInstance.removeTypingStatusListener(setTypingUsers);
  }, [RCInstance, setTypingUsers, currentUserName]);

  const allTypingUsers = useMemo(
    () => [...new Set([...typingUsers, ...extraUsers])],
    [typingUsers, extraUsers]
  );

  const typingStatusMessage = useMemo(() => {
    if (allTypingUsers.length === 0) return '';
    if (allTypingUsers.length === 1)
      return (
        <Box is="span">
          <b>{allTypingUsers[0]}</b>
          {' is typing...'}
        </Box>
      );
    if (allTypingUsers.length === 2)
      return (
        <Box is="span">
          <b>{allTypingUsers[0]}</b>
          {' and '}
          <b>{allTypingUsers[1]}</b>
          {' are typing...'}
        </Box>
      );
    return (
      <Box is="span">
        <b>{allTypingUsers[0]} </b>
        {', '}
        <b>{allTypingUsers[1]} </b>
        {`and ${allTypingUsers.length - 2} more are typing...`}
      </Box>
    );
  }, [allTypingUsers]);

  return (
    <Box
      css={css`
        height: ${allTypingUsers.length !== 0 ? '15px' : '0px'};
        font-size: 0.75rem;
        margin-inline-start: 2.25rem;
        z-index: 1200;
      `}
    >
      {typingStatusMessage}
    </Box>
  );
}
