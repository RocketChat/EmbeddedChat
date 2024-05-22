import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { Box } from '../../components/Box';
import useMemberListStyles from './MembersList.styles';
import { useThemeStore } from '../../store';

function MembersList({ mentionIndex, filteredMembers = [], onMemberClick }) {
  const styles = useMemberListStyles();
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const handleMemberClick = useCallback(
    (selectedItem) => {
      onMemberClick(selectedItem);
    },
    [onMemberClick]
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        const selectedItem =
          mentionIndex < filteredMembers.length
            ? filteredMembers[mentionIndex]
            : mentionIndex === filteredMembers.length
            ? 'all'
            : 'here';
        handleMemberClick(selectedItem);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mentionIndex, filteredMembers, handleMemberClick]);

  return (
    <Box css={styles.main}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filteredMembers.map((member, index) => (
          <li
            key={member._id}
            role="presentation"
            css={styles.listItem}
            onClick={() => handleMemberClick(member)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleMemberClick(member);
              }
            }}
            style={{
              backgroundColor: index === mentionIndex && colors.primary,
              color: index === mentionIndex && colors.primaryForeground,
            }}
          >
            <Box is="span">
              <Box is="span" css={styles.listText}>
                {member.name}
              </Box>
              &nbsp;&nbsp;&nbsp;
              <Box is="span">@{member.username}</Box>
            </Box>
          </li>
        ))}
        <li
          key="all"
          role="presentation"
          css={styles.listItem}
          onClick={() => handleMemberClick('all')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMemberClick('all');
            }
          }}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length && colors.primary,
            color:
              mentionIndex === filteredMembers.length &&
              colors.primaryForeground,
          }}
        >
          <Box is="span" css={styles.listText}>
            all
          </Box>
        </li>
        <li
          key="here"
          role="presentation"
          css={styles.listItem}
          onClick={() => handleMemberClick('here')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMemberClick('here');
            }
          }}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length + 1 && colors.primary,
            color:
              mentionIndex === filteredMembers.length + 1 &&
              colors.primaryForeground,
          }}
        >
          <Box is="span" css={styles.listText}>
            here
          </Box>
        </li>
      </ul>
    </Box>
  );
}

MembersList.propTypes = {
  mentionIndex: PropTypes.any,
  filteredMembers: PropTypes.array,
  onMemberClick: PropTypes.func.isRequired,
};

export default MembersList;
