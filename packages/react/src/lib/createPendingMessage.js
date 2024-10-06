const createRandomId = () => {
  if (typeof window !== 'undefined') {
    if (window.crypto.randomUUID) {
      return window.crypto.randomUUID().replaceAll('-', '').slice(0, 17);
    }
    if (window.crypto.getRandomValues) {
      const array = new window.BigUint64Array(2);
      window.crypto.getRandomValues(array);
      return (array[0] * array[1]).toString(36).slice(0, 17);
    }
  }
  return (
    Math.random().toString(36).replace('0.', '') +
    Math.random().toString(36).replace('0.', '')
  ).slice(2, 19);
};

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
    _id: `ec_${createRandomId()}`,
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
