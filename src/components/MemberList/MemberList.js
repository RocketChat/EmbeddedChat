import { Box } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';

const MemberList = ({ members }) => {
  return (
    <Box>
      {members.map((member) => (
        <Box key={member._id}>{member.name}</Box>
      ))}
    </Box>
  );
};

export default MemberList;

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object),
};
