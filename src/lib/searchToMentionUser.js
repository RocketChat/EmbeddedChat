export const searchToMentionUser = (
  message,
  roomMembers,
  startReading,
  setStartReading,
  setFilteredMembers,
  setmentionIndex,
  setshowMembersList
) => {
  if (message.length === 0) return;
  let lastChar = message[message.length - 1];

  if (lastChar === '@') {
    setStartReading(true);
    setFilteredMembers(roomMembers);
    setmentionIndex(0);
    setshowMembersList(true);
  } else {
    if (startReading) {
      if (lastChar === ' ') {
        setStartReading(false);
        setFilteredMembers([]);
        setmentionIndex(-1);
        setshowMembersList(false);
      } else {
        let c = message.lastIndexOf('@');

        setFilteredMembers(
          roomMembers.filter(
            (member) =>
              member.name
                .toLowerCase()
                .includes(message.substring(c + 1).toLowerCase()) ||
              member.username
                .toLowerCase()
                .includes(message.substring(c + 1).toLowerCase())
          )
        );

        setshowMembersList(true);
        setmentionIndex(0);
      }
    }
  }
};
