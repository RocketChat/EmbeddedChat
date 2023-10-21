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
  
  <div style={{ width:'100%',paddingBottom:'8px',paddingTop:'8px',display:'flex' }}>
    <img src={ `http://localhost:3000/avatar/${user.username}`} alt="avatar" style={{ height:'1.5rem',marginLeft:'0.5rem',}}></img>
    <span style={{ marginLeft:'1.2rem',}}>{user.username}</span>
  </div>
);

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
