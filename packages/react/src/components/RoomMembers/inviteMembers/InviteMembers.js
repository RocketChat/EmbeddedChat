import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@rocket.chat/fuselage';
import { css } from '@emotion/react';
import useInviteStore from '../../../store/inviteStore';
import { Box } from '../../Box';
import { Icon } from '../../Icon';
import { Input } from '../../Input';
import { ActionButton } from '../../ActionButton';

const styles = {
  modal: css`
    position: fixed;
    right: 0;
    top: 0;
    width: 350px;
    height: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
    background-color: white;
    box-shadow: -1px 0px 5px rgb(0 0 0 / 25%);
    z-index: 100;

    @media (max-width: 550px) {
      width: 100vw;
    }
  `,
};

const InviteMembers = ({ inviteData }) => {
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);

  return (
    <Box style={{ padding: '16px' }} css={styles.modal}>
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
      <Box
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <Label>Invite Link</Label>
        <Input readOnly value={inviteData.url} />
      </Box>
      <Label>
        Your invite link will expire on{' '}
        {new Date(inviteData.expires).toString().split('GMT')[0]}
      </Label>
    </Box>
  );
};

export default InviteMembers;

InviteMembers.propTypes = {
  inviteData: PropTypes.object,
};
