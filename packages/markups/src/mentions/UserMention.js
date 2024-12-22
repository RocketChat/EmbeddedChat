import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { useUserStore } from '@embeddedchat/react/src/store';
import useSetExclusiveState from '@embeddedchat/react/src/hooks/useSetExclusiveState';
import RCContext from '@embeddedchat/react/src/context/RCInstance';
import { MarkupInteractionContext } from '../MarkupInteractionContext';
import useMentionStyles from '../elements/elements.styles';

const UserMention = ({ contents }) => {
  const { members, username } = useContext(MarkupInteractionContext);
  const { RCInstance } = useContext(RCContext);
  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo,
    setCurrentUser: state.setCurrentUser,
  }));

  const handleUserInfo = async (uname) => {
    const data = await RCInstance.userData(uname);
    setCurrentUser({
      _id: data.user._id,
      username: data.user.username,
      name: data.user.name,
    });
    setExclusiveState(setShowCurrentUserInfo);
  };

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
        <Box
          is="span"
          css={styles.mention}
          onClick={
            ['here', 'all'].includes(contents.value)
              ? null
              : () => handleUserInfo(contents.value)
          }
        >
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
