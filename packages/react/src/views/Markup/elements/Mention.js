import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../../components/Box';
import { useMemberStore, useUserStore } from '../../../store';
import useMentionStyles from './elements.styles';

const Mention = ({ contents }) => {
  const members = useMemberStore((state) => state.members);
  const username = useUserStore((state) => state.username);

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
  const styles = useMentionStyles(contents, username);
  return (
    <>
      {hasMember(contents.value) === true ? (
        <Box is="span" css={styles.mention}>
          {contents.value}
        </Box>
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
