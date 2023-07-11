import React from 'react';
import PropTypes from 'prop-types';
import { StatusBullet } from '@rocket.chat/fuselage';

const UserStatus = ({ status }) => {
  switch (status) {
    case 'online':
      return <StatusBullet size="large" status={status} title="onine" />;
    case 'busy':
      return <StatusBullet size="large" status={status} title="busy" />;
    case 'away':
      return <StatusBullet size="large" status={status} title="away" />;
    case 'offline':
      return <StatusBullet size="large" status={status} title="offline" />;
    default:
      return <StatusBullet size="large" title="Loading" />;
  }
};

export default UserStatus;

UserStatus.propTypes = {
  status: PropTypes.string,
};
