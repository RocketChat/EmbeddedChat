import React, { useEffect, useCallback, useRef } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';

function MembersList({ mentionIndex, filteredMembers = [], onMemberClick }) {
  const listStyle = css`
    margin-bottom: 5px;
    display: block;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 105px;
    scrollbar-width: thin;
    scrollbar-color: #e0e0e1 transparent;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #e0e0e1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #e0e0e1;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;

  const listItemStyle = css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    padding-right: 2px;

    &:hover {
      background-color: #e8e8e8;
    }
  `;

  const listTextStyle = css`
    color: #000000;
    font-weight: 600;
  `;

  const memberRef = useRef(null); 

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

  useEffect(() => {
    if (memberRef.current) {
      const selectedMember = memberRef.current.children[mentionIndex];
      if (selectedMember) {
        selectedMember.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [mentionIndex]);

  return (
    <Box css={listStyle}>
      <ul style={{ listStyle: 'none' }} ref={memberRef}>
        {filteredMembers.map((member, index) => (
          <li
            key={member._id}
            role="presentation"
            css={listItemStyle}
            onClick={() => handleMemberClick(member)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleMemberClick(member);
              }
            }}
            style={{
              backgroundColor: index === mentionIndex && '#dddddd',
            }}
          >
            <span style={{ justifyContent: 'space-evenly' }}>
              <span css={listTextStyle}>{member.name}</span>
              &nbsp;&nbsp;&nbsp;
              <span>@{member.username}</span>
            </span>
          </li>
        ))}
        <li
          key="all"
          role="presentation"
          css={listItemStyle}
          onClick={() => handleMemberClick('all')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMemberClick('all');
            }
          }}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length && '#dddddd',
          }}
        >
          <span css={listTextStyle}>all</span>
        </li>
        <li
          key="here"
          role="presentation"
          css={listItemStyle}
          onClick={() => handleMemberClick('here')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMemberClick('here');
            }
          }}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length + 1 && '#dddddd',
          }}
        >
          <span css={listTextStyle}>here</span>
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
