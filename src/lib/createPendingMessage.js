const createPendingMessage = (
  message,
  user = {
    _id: undefined,
    username: undefined,
    name: undefined,
  }
) => {
  const now = new Date();
  return {
    isPending: true,
    _id: `ec_${Math.random().toString(36).slice(2, 17)}`,
    rid: 'GENERAL',
    msg: message,
    ts: now.toISOString(),
    u: {
      _id: user._id,
      username: user.username,
      name: user.name,
    },
    _updatedAt: now.toISOString(),
    urls: [],
    mentions: [],
    channels: [],
    md: [
      {
        type: 'PARAGRAPH',
        value: [
          {
            type: 'PLAIN_TEXT',
            value: message,
          },
        ],
      },
    ],
  };
};

export default createPendingMessage;
