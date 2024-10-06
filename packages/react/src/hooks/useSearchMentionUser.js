import { useCallback } from 'react';

const useSearchMentionUser = (
  members,
  startReadMentionUser,
  setStartReadMentionUser,
  setFilteredMembers,
  setMentionIndex,
  setShowMembersList
) =>
  useCallback(
    (message) => {
      const lastChar = message ? message[message.length - 1] : '';

      if (message.length === 0) {
        setShowMembersList(false);
        setStartReadMentionUser(false);
        setFilteredMembers([]);
        setMentionIndex(-1);
        return;
      }

      if (
        lastChar === '@' &&
        (message.length === 1 || message[message.length - 2] === ' ')
      ) {
        setStartReadMentionUser(true);
        setFilteredMembers(members);
        setMentionIndex(0);
        setShowMembersList(true);
        return;
      }

      if (startReadMentionUser) {
        if (lastChar === ' ') {
          setStartReadMentionUser(false);
          setFilteredMembers([]);
          setMentionIndex(-1);
          setShowMembersList(false);
        } else {
          const query = message
            .substring(message.lastIndexOf('@') + 1)
            .toLowerCase();
          const filteredMentionMembers = members.filter(
            (member) =>
              member.name.toLowerCase().includes(query) ||
              member.username.toLowerCase().includes(query)
          );

          setFilteredMembers(filteredMentionMembers);

          const isValidUsername = filteredMentionMembers.length > 0;

          setShowMembersList(isValidUsername);
          setMentionIndex(isValidUsername ? 0 : -1);
        }
      }
    },
    [
      members,
      startReadMentionUser,
      setStartReadMentionUser,
      setFilteredMembers,
      setMentionIndex,
      setShowMembersList,
    ]
  );

export default useSearchMentionUser;
