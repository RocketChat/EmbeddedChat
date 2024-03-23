export const serializeReactions = (reactions) => {
  const arr = [];

  const emojis = Object.keys(reactions);
  emojis.forEach((emoji) =>
    arr.push({
      name: emoji,
      count: reactions[emoji].usernames.length,
      usernames: reactions[emoji].usernames,
    })
  );

  return arr;
};

export const isSameUser = (reaction, username) =>
  reaction.usernames.find((u) => u === username);
