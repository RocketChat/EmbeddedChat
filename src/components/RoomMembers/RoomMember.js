import React from 'react';
import PropTypes from 'prop-types';
import { Box, Icon, ActionButton } from '@rocket.chat/fuselage';
import RoomMemberItem from './RoomMemberItem';
import classes from './RoomMember.module.css';
import { useMemberStore } from '../../store';

const RoomMembers = ({ members }) => {
  const toggleShowMembers = useMemberStore((state) => state.toggleShowMembers);

  return (
    <Box className={classes.modal} p="x16">
      <Box
        data-qa-id="RoomHeader-Members"
        display="flex"
        alignItems="center"
        height="56px"
        is="h3"
        pi="x24"
        borderBlockEndWidth="default"
        borderBlockColor="extra-light"
        flexShrink={0}
      >
        <Icon name="members" pi="x2" size="x24" />
        <Box>Members</Box>
        <ActionButton
          onClick={toggleShowMembers}
          ghost
          display="inline"
          square
          small
          className={classes.close}
        >
          <Icon name="cross" size="x20" />
        </ActionButton>
      </Box>
      {members.map((member) => (
        <RoomMemberItem user={member} key={member._id} />
      ))}
    </Box>
  );
};
export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
