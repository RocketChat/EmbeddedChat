import React from 'react';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';

const UserInfoField = ({
  label,
  value,
  isAdmin,
  authenticatedUserId,
  currentUserInfo,
}) => {
  const shouldRender = isAdmin || authenticatedUserId === currentUserInfo._id;
  return shouldRender ? (
    <Box
      css={css`
        margin-block: 15px;
      `}
    >
      <Box
        css={css`
          margin-block: 5px;
          font-weight: bold;
        `}
      >
        {label}
      </Box>
      <Box
        css={css`
          opacity: 0.5rem;
        `}
      >
        {value}
      </Box>
    </Box>
  ) : null;
};

export default UserInfoField;
