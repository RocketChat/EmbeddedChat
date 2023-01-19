import React from 'react';
import PropTypes from 'prop-types';
import {
  Option,
  OptionColumn,
  OptionDescription,
  OptionContent,
} from '@rocket.chat/fuselage';
import UserStatus from './UserStatus';

const RoomMemberItem = ({ user }) => (
  <Option data-username={user.username} data-userid={user._id}>
    <OptionColumn>
      <UserStatus status={user.status} />
    </OptionColumn>
    <OptionContent data-qa={`MemberItem-${user.username}`}>
      {user.name} <OptionDescription>({user.username})</OptionDescription>
    </OptionContent>
  </Option>
);

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
