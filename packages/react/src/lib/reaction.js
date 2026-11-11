export const serializeReactions = (reactions) => {
  if (!reactions || typeof reactions !== 'object') {
    return [];
  }
  const arr = [];
  const emojis = Object.keys(reactions);
  emojis.forEach((emoji) => {
    const reaction = reactions[emoji];
    if (reaction && Array.isArray(reaction.usernames)) {
      arr.push({
        name: emoji,
        count: reaction.usernames.length,
        usernames: reaction.usernames,
        names: Array.isArray(reaction.names) ? reaction.names : [],
      });
    }
  });

  return arr;
};

export const isSameUser = (reaction, username) =>
  Boolean(reaction?.usernames?.find((u) => u === username));

export const getReactorsList = (reactions, targetEmoji = null) => {
  if (!reactions || typeof reactions !== 'object') {
    return [];
  }

  const result = [];
  const emojis =
    targetEmoji && targetEmoji !== 'all'
      ? [targetEmoji]
      : Object.keys(reactions);

  emojis.forEach((emoji) => {
    const data = reactions[emoji];
    if (data && Array.isArray(data.usernames)) {
      data.usernames.forEach((username, idx) => {
        const name = (data.names && data.names[idx]) || username;
        result.push({
          username,
          name,
          emoji,
        });
      });
    }
  });

  return result;
};

export const getTotalReactionCount = (reactions) => {
  if (!reactions || typeof reactions !== 'object') {
    return 0;
  }
  return Object.values(reactions).reduce(
    (sum, r) => sum + (Array.isArray(r?.usernames) ? r.usernames.length : 0),
    0
  );
};
