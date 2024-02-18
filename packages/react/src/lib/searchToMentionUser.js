export const searchToMentionUser = (
  message,
  roomMembers,
  startReading,
  setStartReading,
  setFilteredMembers,
  setmentionIndex,
  setshowMembersList
) => {
  const lastChar = message ? message[message.length - 1] : '';
  if (message.length === 0) {
    setshowMembersList(false);
    setStartReading(false);
    setFilteredMembers([]);
    setmentionIndex(-1);
    return;
  }

  if (lastChar === '@') {
    if (message.length > 1 && message[message.length - 2] !== ' ') return;
    setStartReading(true);
    setFilteredMembers(roomMembers);
    setmentionIndex(0);
    setshowMembersList(true);
  } else if (startReading) {
    if (lastChar === ' ') {
      setStartReading(false);
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

      const isValidUsername = roomMembers.some(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.username.toLowerCase().includes(query)
      );


      if (isValidUsername) {
        setshowMembersList(true);
        setmentionIndex(0);
      } else {
        setshowMembersList(false);
        setmentionIndex(-1);
      }
    }
  }
};
