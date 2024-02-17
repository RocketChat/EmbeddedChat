import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';

function MembersList({ mentionIndex, filteredMembers = [], onMemberClick }) {
  const listStyle = css`
    margin-bottom: 5px;
    display: block;
    max-height: 10rem;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 145px;
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

  const handleMemberClick = (selectedItem) => {
    onMemberClick(selectedItem);
  };

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

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [mentionIndex, filteredMembers, handleMemberClick]);

  return (
    <Box css={listStyle}>
      <ul style={{ listStyle: 'none' }}>
        {filteredMembers.map((member, index) => (
          <li
            key={member._id}
            css={listItemStyle}
            style={{
              backgroundColor: index === mentionIndex && '#dddddd',
            }}
            onClick={() => handleMemberClick(member)}
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
          css={listItemStyle}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length && '#dddddd',
          }}
          onClick={() => handleMemberClick('all')}
        >
          <span css={listTextStyle}>all</span>
        </li>
        <li
          key="here"
          css={listItemStyle}
          style={{
            backgroundColor:
              mentionIndex === filteredMembers.length + 1 && '#dddddd',
          }}
          onClick={() => handleMemberClick('here')}
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
