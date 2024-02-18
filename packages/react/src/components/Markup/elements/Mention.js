import React from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { useMemberStore, useUserStore } from '../../../store';

const Mention = ({ contents }) => {
  const members = useMemberStore((state) => state.members);
  const username = useUserStore((state) => state.username);

  const mentionStyles = css`
    background-color: ${contents.value === 'all' || contents.value === 'here'
      ? '#f38c39'
      : contents.value === username
      ? '#ec0d2a'
      : '#e4e7ea'};
    color: ${contents.value === 'all' || contents.value === 'here'
      ? '#ffffff'
      : contents.value === username
      ? '#ffffff'
      : '#2f343d'};
    font-weight: bold;
    cursor: pointer;
    padding: 1.5px;
    border-radius: 3px;

    &:hover {
      text-decoration: ${contents.value === 'all' || contents.value === 'here'
        ? 'none'
        : 'underline'};
    }
  `;

  const hasMember = (user) => {
    if (user === 'all' || user === 'here') return true;
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
        <span css={mentionStyles}>{contents.value}</span>
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
