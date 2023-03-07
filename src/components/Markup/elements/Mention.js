import React from 'react';
import PropTypes from 'prop-types';
import useMentionMemberStore from '../../../store/mentionmemberStore';

const Mention = ({ contents }) => {
  const members = useMentionMemberStore((state) => state.roomMembers || []);
  const hasMember = (user) => {
    if (user === 'all' || user === 'everyone') return true;
    let found = false;
    Object.keys(members).forEach((ele) => {
      if (members[ele].username === user) {
        found = true;
      }
    });
    return found;
  };
  return (
    <>
      {hasMember(contents.value) === true ? (
        <span style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
          {contents.value}
        </span>
      ) : (
        `@${contents.value}`
      )}
    </>
  );
};

export default Mention;

Mention.propTypes = {
  contents: PropTypes.any,
};
