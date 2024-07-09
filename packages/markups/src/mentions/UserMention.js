import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { MarkupInteractionContext } from '../MarkupInteractionContext';
import useMentionStyles from '../elements/elements.styles';

const UserMention = ({ contents }) => {
  const { members, username } = useContext(MarkupInteractionContext);

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
      {hasMember(contents.value) ? (
        <Box is="span" css={styles.mention}>
          {contents.value}
        </Box>
      ) : (
        `@${contents.value}`
      )}
    </>
  );
};

UserMention.propTypes = {
  contents: PropTypes.any.isRequired,
};

export default UserMention;
