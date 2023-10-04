import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import RoomMemberItem from './RoomMemberItem';
import { css } from '@emotion/react'; // Step 1: Import `css` from Emotion.sh
import { useMemberStore } from '../../store';
import RCContext from '../../context/RCInstance';
import useInviteStore from '../../store/inviteStore';
import InviteMembers from './inviteMembers/InviteMembers';
import { Button } from '../Button';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';

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
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  `,
};

const RoomMembers = ({ members }) => {
  const { RCInstance } = useContext(RCContext);

  const toggleShowMembers = useMemberStore((state) => state.toggleShowMembers);
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const showInvite = useInviteStore((state) => state.showInvite);

  const [inviteData, setInviteData] = useState(null);

  if (showInvite) return <InviteMembers inviteData={inviteData} />;

  return (
    <Box css={styles.modal} style={{ padding: '16px' }}>
      <Box style={{ display: 'flex' }}>
        <h3 style={{ display: 'contents' }}>
          <Icon
            name="members"
            size="1.25rem"
            style={{ padding: '0px 20px 20px 0px' }}
          />
          <Box style={{ color: '#4a4a4a', width: '80%' }}>Members</Box>
          <ActionButton onClick={toggleShowMembers} ghost size="small">
            <Icon name="cross" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>
      <Box css={styles.container}>
        {members.map((member) => (
          <RoomMemberItem user={member} key={member._id} />
        ))}
      </Box>
      <Button
        style={{ marginTop: '10px', width: '100%' }}
        onClick={async () => {
          const res = await RCInstance.findOrCreateInvite();
          setInviteData(res);
          toggleInviteView();
        }}
      >
        <Icon size="1em" name="link" /> Invite Link
      </Button>
    </Box>
  );
};

export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
