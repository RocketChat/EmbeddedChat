import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import getMemberListStyles from './MembersList.styles';

function MembersList({
  mentionIndex,
  messageRef,
  filteredMembers = [],
  setFilteredMembers,
  setMentionIndex,
  setStartReadMentionUser,
  setShowMembersList,
}) {
  const itemRefs = useRef([]);
  const { theme } = useTheme();
  const styles = getMemberListStyles(theme);

  const handleMemberClick = useCallback(
    (selectedItem) => {
      let insertionText;
      if (selectedItem === 'all') {
        insertionText = `${messageRef.current.value.substring(
          0,
          messageRef.current.value.lastIndexOf('@')
        )}@all `;
      } else if (selectedItem === 'here') {
        insertionText = `${messageRef.current.value.substring(
          0,
          messageRef.current.value.lastIndexOf('@')
        )}@here `;
      } else {
        insertionText = `${messageRef.current.value.substring(
          0,
          messageRef.current.value.lastIndexOf('@')
        )}@${selectedItem.username} `;
      }

      messageRef.current.value = insertionText;

      const cursorPosition = insertionText.length;
      messageRef.current.setSelectionRange(cursorPosition, cursorPosition);
      messageRef.current.focus();

      setFilteredMembers([]);
      setMentionIndex(-1);
      setStartReadMentionUser(false);
      setShowMembersList(false);
    },
    [
      messageRef,
      setFilteredMembers,
      setMentionIndex,
      setShowMembersList,
      setStartReadMentionUser,
    ]
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
              backgroundColor: index === mentionIndex && theme.colors.primary,
              color: index === mentionIndex && theme.colors.primaryForeground,
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
              mentionIndex === filteredMembers.length && theme.colors.primary,
            color:
              mentionIndex === filteredMembers.length &&
              theme.colors.primaryForeground,
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
              mentionIndex === filteredMembers.length + 1 &&
              theme.colors.primary,
            color:
              mentionIndex === filteredMembers.length + 1 &&
              theme.colors.primaryForeground,
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
  mentionIndex: PropTypes.number,
  messageRef: PropTypes.object.isRequired,
  filteredMembers: PropTypes.array,
  setFilteredMembers: PropTypes.func.isRequired,
  setMentionIndex: PropTypes.func.isRequired,
  setStartReadMentionUser: PropTypes.func.isRequired,
  setShowMembersList: PropTypes.func.isRequired,
};

export default MembersList;
