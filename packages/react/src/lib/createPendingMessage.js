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

const createPendingAudioMessage = (
  file,
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
    msg: '',
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
    file: {
      _id: file._id,
      name: file.name,
      type: file.type,
      size: file.size,
      format: file.format || '',
    },
    files: [
      {
        _id: file._id,
        name: file.name,
        type: file.type,
        size: file.size,
        format: file.format || '',
      },
    ],
    attachments: [
      {
        ts: '1970-01-01T00:00:00.000Z',
        title: file.name,
        title_link: `/file-upload/${file._id}/${encodeURIComponent(file.name)}`,
        title_link_download: true,
        audio_url: `/file-upload/${file._id}/${encodeURIComponent(file.name)}`,
        audio_type: file.type,
        audio_size: file.size,
        type: 'file',
        description: '',
      },
    ],
    md: [],
  };
};

const createPendingVideoMessage = (
  file,
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
    msg: '',
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
    file: {
      _id: file._id,
      name: file.name,
      type: file.type,
      size: file.size,
      format: file.format || '',
    },
    files: [
      {
        _id: file._id,
        name: file.name,
        type: file.type,
        size: file.size,
        format: file.format || '',
      },
    ],
    attachments: [
      {
        ts: '1970-01-01T00:00:00.000Z',
        title: file.name,
        title_link: `/file-upload/${file._id}/${encodeURIComponent(file.name)}`,
        title_link_download: true,
        video_url: `/file-upload/${file._id}/${encodeURIComponent(file.name)}`,
        video_type: file.type,
        video_size: file.size,
        type: 'file',
        description: '',
      },
    ],
    md: [],
  };
};

const createPendingFileMessage = (
  file,
  user = {
    _id: undefined,
    username: undefined,
    name: undefined,
  },
  description = 'Hahahaha'
) => {
  const now = new Date();
  return {
    isPending: true,
    _id: `ec_${createRandomId()}`,
    rid: 'GENERAL',
    msg: '',
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
    file: {
      _id: '',
      name: file.name,
      type: file.type,
      size: file.size,
      format: file.format || '',
    },
    files: [
      {
        _id: '',
        name: file.name,
        type: file.type,
        size: file.size,
        format: file.format || '',
      },
    ],
    attachments: [
      {
        ts: '1970-01-01T00:00:00.000Z',
        title: file.name,
        title_link: `/file-upload/${file.name}/${encodeURIComponent(
          file.name
        )}`,
        title_link_download: true,
        type: 'file',
        description,
        format: file.format || '',
        size: file.size,
        descriptionMd: [
          {
            type: 'PARAGRAPH',
            value: [
              {
                type: 'PLAIN_TEXT',
                value: description,
              },
            ],
          },
        ],
      },
    ],
    md: [],
  };
};

export {
  createPendingMessage,
  createPendingAudioMessage,
  createPendingVideoMessage,
  createPendingFileMessage,
};
