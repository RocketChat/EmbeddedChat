export const searchToMentionUser = (
  message,
  roomMembers,
  startReadMentionUser,
  setStartReadMentionUser,
  setFilteredMembers,
  setmentionIndex,
  setshowMembersList
) => {
  const lastChar = message ? message[message.length - 1] : '';

  if (message.length === 0) {
    setshowMembersList(false);
    setStartReadMentionUser(false);
    setFilteredMembers([]);
    setmentionIndex(-1);
    return;
  }

  if (
    lastChar === '@' &&
    (message.length === 1 || message[message.length - 2] === ' ')
  ) {
    setStartReadMentionUser(true);
    setFilteredMembers(roomMembers);
    setmentionIndex(0);
    setshowMembersList(true);
    return;
  }

  if (startReadMentionUser) {
    if (lastChar === ' ') {
      setStartReadMentionUser(false);
      setFilteredMembers([]);
      setmentionIndex(-1);
      setshowMembersList(false);
    } else {
      const query = message
        .substring(message.lastIndexOf('@') + 1)
        .toLowerCase();
      const filteredMentionMembers = roomMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.username.toLowerCase().includes(query)
      );

      setFilteredMembers(filteredMentionMembers);

      const isValidUsername = filteredMentionMembers.length > 0;

      setshowMembersList(isValidUsername);
      setmentionIndex(isValidUsername ? 0 : -1);
    }
  }
};
