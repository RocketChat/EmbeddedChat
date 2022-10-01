export const serializeReactions = (reactions) => {
  let arr = [];

  for (let emoji in reactions) {
    arr.push({
      name: emoji,
      count: reactions[emoji].usernames.length,
      usernames: reactions[emoji].usernames,
    });
  }

  return arr;
};

export const isSameUser = (reaction, username) => {
  return reaction.usernames.find((u) => u === username);
};
