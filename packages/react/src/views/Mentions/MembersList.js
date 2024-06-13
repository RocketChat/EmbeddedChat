import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import useMemberListStyles from './MembersList.styles';
import { useCustomTheme } from '../../hooks/useCustomTheme';

function MembersList({
  mentionIndex,
  filteredMembers = [],
  setMentionIndex,
  onMemberClick,
}) {
  const itemRefs = useRef([]);
  const styles = useMemberListStyles();
  const { colors } = useCustomTheme();

  const handleMemberClick = useCallback(
    (selectedItem) => {
      onMemberClick(selectedItem);
    },
    [onMemberClick]
  );

  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Enter': {
          const selectedItem =
            mentionIndex < filteredMembers.length
              ? filteredMembers[mentionIndex]
              : mentionIndex === filteredMembers.length
              ? 'all'
              : 'here';
          handleMemberClick(selectedItem);
          break;
        }
        case 'ArrowUp':
          event.preventDefault();
          setMentionIndex(
            mentionIndex - 1 < 0 ? filteredMembers.length + 1 : mentionIndex - 1
          );
          break;
        case 'ArrowDown':
          setMentionIndex(
            mentionIndex + 1 >= filteredMembers.length + 2
              ? 0
              : mentionIndex + 1
          );
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [mentionIndex, filteredMembers, handleMemberClick, setMentionIndex]);

  useEffect(() => {
    if (itemRefs.current[mentionIndex]) {
      itemRefs.current[mentionIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [mentionIndex]);

  return (
    <Box css={styles.main}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filteredMembers.map((member, index) => (
          <li
            key={member._id}
            role="presentation"
            css={styles.listItem}
            onClick={() => handleMemberClick(member)}
            ref={(el) => setItemRef(el, index)}
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
          ref={(el) => setItemRef(el, filteredMembers.length)}
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
          ref={(el) => setItemRef(el, filteredMembers.length + 1)}
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
