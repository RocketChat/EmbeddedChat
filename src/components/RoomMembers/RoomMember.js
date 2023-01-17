/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Icon } from '@rocket.chat/fuselage';
import RoomMemberItem from './RoomMemberItem';
import classes from './RoomMember.module.css';
import { useMemberStore } from '../../store';

const RoomMembers = ({ members }) => {
  const showMembersHandler = useMemberStore(
    (state) => state.showMembersHandler
  );

  const showChannelMembers = async () => {
    showMembersHandler(false);
  };
  return (
    <div className={classes.modal}>
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
        <div
          className={classes.close}
          onClick={showChannelMembers}
          onKeyPress={showChannelMembers}
          role="button"
          tabIndex="0"
        >
          x
        </div>
      </Box>
      {members.map((member, index) => (
        <RoomMemberItem user={member} key={index} />
      ))}
    </div>
  );
};
export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
