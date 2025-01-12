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

const createPendingAttachmentMessage = (
  file,
  user = { _id: undefined, username: undefined, name: undefined },
  description = '',
  fileType = 'file',
  additionalFields = {}
) => {
  const now = new Date();

  const fileProps = {
    _id: file._id || '',
    name: file.name,
    type: file.type,
    size: file.size,
    format: file.format || '',
  };

  const attachment = {
    ts: '1970-01-01T00:00:00.000Z',
    title: file.name,
    title_link: `/file-upload/${file._id || file.name}/${encodeURIComponent(
      file.name
    )}`,
    title_link_download: true,
    type: 'file',
    description,
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
    ...additionalFields, // Add extra fields for file-specific types like audio, video, or image
  };

  // Add fileType-specific fields
  if (fileType === 'audio') {
    attachment.audio_url = `/file-upload/${
      file._id || file.name
    }/${encodeURIComponent(file.name)}`;
    attachment.audio_type = file.type;
    attachment.audio_size = file.size;
  } else if (fileType === 'video') {
    attachment.video_url = `/file-upload/${
      file._id || file.name
    }/${encodeURIComponent(file.name)}`;
    attachment.video_type = file.type;
    attachment.video_size = file.size;
  } else if (fileType === 'image') {
    attachment.image_preview = file.image_preview || '';
    attachment.image_url = file.image_url;
    attachment.image_type = file.type;
    attachment.image_size = file.size;
  }

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
    file: fileProps,
    files: [fileProps],
    attachments: [attachment],
    md: [],
  };
};

export { createPendingMessage, createPendingAttachmentMessage };
