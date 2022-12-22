/* eslint-disable guard-for-in */
export const serializeReactions = (reactions) => {
  const arr = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const emoji in reactions) {
    arr.push({
      name: emoji,
      count: reactions[emoji].usernames.length,
      usernames: reactions[emoji].usernames,
    });
  }

  return arr;
};

export const isSameUser = (reaction, username) =>
  reaction.usernames.find((u) => u === username);
