import { css } from '@emotion/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';
import { Box } from '../Box';

export default function TypingUsers() {
  const { RCInstance } = useContext(RCContext);
  const currentUserName = useUserStore((state) => state.username);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    RCInstance?.addTypingStatusListener((t) => {
      setTypingUsers((t || []).filter((u) => u !== currentUserName));
    });
    return () => RCInstance?.removeTypingStatusListener(setTypingUsers);
  }, [RCInstance, setTypingUsers, currentUserName]);

  const typingStatusMessage = useMemo(() => {
    if (!typingUsers.length) return '';

    if (typingUsers.length) {
      const otherTypingUsers = typingUsers.filter((user) => user !== currentUserName);

      if (typingUsers.length === 1) {
        if (typingUsers.includes(currentUserName)) {
          return '';
        }
        return (
          <span>
            <b>{typingUsers[0]}</b>
            {' is typing...'}
          </span>
        );
      }

      if (typingUsers.length === 2) {
        if (typingUsers.includes(currentUserName)) {
          return (
            <span>
              <b>{otherTypingUsers[0]}</b>
              {' is typing...'}
            </span>
          );
        }
        return (
          <span>
            <b>{typingUsers[0]}</b>
            {' and '}
            <b>{typingUsers[1]}</b>
            {' are typing...'}
          </span>
        );
      }

      if (typingUsers.length === 3) {
        if (typingUsers.includes(currentUserName)) {
          return (
            <span>
              <b>{otherTypingUsers[0]}</b>
              {' and '}
              <b>{otherTypingUsers[1]}</b>
              {' are typing...'}
            </span>
          );
        }
        return (
          <span>
            <b>{typingUsers[0]} </b>
            {', '}
            <b>{typingUsers[1]} </b>
            {`and 1 more are typing...`}
          </span>
        );
      }

      if (typingUsers.includes(currentUserName)) {
        return (
          <span>
            <b>{typingUsers[0]} </b>
            {', '}
            <b>{typingUsers[1]} </b>
            {`and ${typingUsers.length - 3} more are typing...`}
          </span>
        );
      }
      return (
        <span>
          <b>{typingUsers[0]} </b>
          {', '}
          <b>{typingUsers[1]} </b>
          {`and ${typingUsers.length - 2} more are typing...`}
        </span>
      );
    }

  }, [typingUsers, currentUserName]);

  return (
    <Box
      css={css`
        height: 24px;
        font-size: 0.75rem;
        margin-block-end: -24px;
        margin-inline-start: 0.25rem;
        z-index: 100;
      `}
    >
      {typingStatusMessage}
    </Box>
  );
}
