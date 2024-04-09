import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useInviteStore from '../../../store/inviteStore';
import { useToastBarDispatch } from '../../../hooks/useToastBarDispatch';
import { Box } from '../../Box';
import { Icon } from '../../Icon';
import { Input } from '../../Input';
import { ActionButton } from '../../ActionButton';

const InviteMembers = ({ inviteData }) => {
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const dispatchToastMessage = useToastBarDispatch();

  const copyToClipboard = () => {
    if (inviteData && inviteData.url) {
      navigator.clipboard
        .writeText(inviteData.url)
        .then(() => {
          dispatchToastMessage({
            type: 'success',
            message: 'Copied to clipboard',
          });
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    }
  };

  return (
    <Box>
      <Box
        css={css`
          display: flex;
        `}
      >
        <h3 style={{ display: 'contents' }}>
          <Icon
            name="link"
            size="1.25rem"
            style={{ padding: '0px 20px 20px 0px' }}
          />
          <Box
            css={css`
              width: 80%;
              color: #4a4a4a;
            `}
          >
            Invite Members
          </Box>
          <ActionButton onClick={() => toggleInviteView()} ghost size="small">
            <Icon name="back" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>
      {inviteData && (
        <Box
          css={css`
            width: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          <Box
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            `}
          >
            <span>
              <b>Invite Link</b>
            </span>
            <ActionButton onClick={copyToClipboard} ghost size="small">
              <Icon name="copy" size="1.25rem" />
            </ActionButton>
          </Box>
          <Input readOnly value={inviteData.url} />
        </Box>
      )}
      <div
        css={css`
          margin-top: 8px;
        `}
      >
        {inviteData && (
          <p
            css={css`
              color: #9ea2a8;
              font-size: 0.78em;
            `}
          >
            <b>
              Your invite link will expire on{' '}
              {new Date(inviteData.expires).toString().split('GMT')[0]}
            </b>
          </p>
        )}
      </div>
    </Box>
  );
};

export default InviteMembers;

InviteMembers.propTypes = {
  inviteData: PropTypes.object,
};
