import React from 'react'
import PropTypes from 'prop-types'
// import mentionmemberStore from '../../store/mentionmemberStore';

function MembersList({mentionIndex, filteredMembers}) {
    
  return (
    <div style={{ display: 'block' }}>
          <ul style={{ listStyle: 'none' }}>
            {filteredMembers.map((member, index) => (
              <li
                key={member._id}
                style={{
                  backgroundColor: index === mentionIndex ? '#ddd' : 'white',
                }}
              >
                {member.name} @{member.username}
              </li>
            ))}
             <li
                key="all"
                style={{
                  backgroundColor: mentionIndex === filteredMembers.length ? '#ddd' : 'white',
                }}
              >
                all
              </li>
              <li
                key="everyone"
                style={{
                  backgroundColor: mentionIndex === filteredMembers.length + 1 ? '#ddd' : 'white',
                }}
              >
                everyone
              </li>
          </ul>
        </div>
  )
}

MembersList.propTypes = {
    mentionIndex: PropTypes.any,
    filteredMembers: PropTypes.array
}

export default MembersList;
