import React from 'react';
import PropTypes from 'prop-types';
import { useMemberStore } from '../../../store';
import PlainSpan from './PlainSpan';

const Mention = ({ value }) => {
  const members = useMemberStore((state) => state.members || []);
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
      {hasMember(value.value) === true ? (
        <PlainSpan style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
          {value.value}
        </PlainSpan>
      ) : (
        `@${value.value}`
      )}
    </>
  );
};

export default Mention;

Mention.propTypes = {
  value: PropTypes.any,
};
