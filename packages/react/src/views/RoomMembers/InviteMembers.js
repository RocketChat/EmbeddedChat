import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useInviteStore from '../../store/inviteStore';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import { Input } from '../../components/Input';
import { ActionButton } from '../../components/ActionButton';
import Heading from '../../components/Heading/Heading';
import { InviteMemberStyles as styles } from './RoomMembers.styles';

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
        <Heading level={3} style={{ display: 'contents' }}>
          <Icon
            name="link"
            size="1.25rem"
            css={css`
              padding: 0px 20px 20px 0px;
            `}
          />
          <Box
            css={css`
              width: 80%;
            `}
          >
            Invite Members
          </Box>
          <ActionButton onClick={() => toggleInviteView()} ghost size="small">
            <Icon name="back" size="1.25rem" />
          </ActionButton>
        </Heading>
      </Box>
      {inviteData && (
        <Box css={styles.parentContainer}>
          <Box css={styles.childContainer}>
            <Box is="span">
              <b>Invite Link</b>
            </Box>
            <ActionButton onClick={copyToClipboard} ghost size="small">
              <Icon name="copy" size="1.25rem" />
            </ActionButton>
          </Box>
          <Input readOnly value={inviteData.url} />
        </Box>
      )}
      <Box
        css={css`
          margin-top: 8px;
        `}
      >
        {inviteData && (
          <p
            css={css`
              font-size: 0.78em;
            `}
          >
            <b>
              Your invite link will expire on{' '}
              {new Date(inviteData.expires).toString().split('GMT')[0]}
            </b>
          </p>
        )}
      </Box>
    </Box>
  );
};

export default InviteMembers;

InviteMembers.propTypes = {
  inviteData: PropTypes.object,
};
