import { css } from '@emotion/react';
import { useTheme, Box } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';

export default function TypingUsers() {
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

  const typingStatusMessage = useMemo(() => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1)
      return (
        <Box is="span">
          <b>{typingUsers[0]}</b>
          {i18n.t('User_Action_User_Typing_One', { user: typingUsers[0] })}
        </Box>
      );
    if (typingUsers.length === 2)
      return (
        <Box is="span">
          <b>{typingUsers[0]}</b>
          {i18n.t('User_Action_User_Typing_Two', {
            user1: typingUsers[0],
            user2: typingUsers[1],
          })}
        </Box>
      );
    return (
      <Box is="span">
        <b>{typingUsers[0]} </b>
        {i18n.t('User_Action_User_Typing_Multiple', {
          count: typingUsers.length - 2,
        })}
      </Box>
    );
  }, [typingUsers]);

  return (
    <Box
      css={css`
        height: ${typingUsers.length !== 0 ? '15px' : '0px'};
        font-size: 0.75rem;
        margin-inline-start: 2.25rem;
        z-index: 1200;
      `}
    >
      {typingStatusMessage}
    </Box>
  );
}
