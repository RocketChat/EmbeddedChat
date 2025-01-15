const searchNote = {
  msg: 'You can search using [Regular Expression](https://en.wikipedia.org/wiki/Regular_expression). e.g. `/^text$/i`',
  md: [
    {
      type: 'PARAGRAPH',
      value: [
        {
          type: 'PLAIN_TEXT',
          value: 'You can search using ',
        },
        {
          type: 'LINK',
          value: {
            src: {
              type: 'PLAIN_TEXT',
              value: 'https://en.wikipedia.org/wiki/Regular_expression',
            },
            label: [
              {
                type: 'PLAIN_TEXT',
                value: 'Regular Expression',
              },
            ],
          },
        },
        {
          type: 'PLAIN_TEXT',
          value: '. e.g. ',
        },
        {
          type: 'INLINE_CODE',
          value: {
            type: 'PLAIN_TEXT',
            value: '/^text$/i',
          },
        },
      ],
    },
  ],
};

export default searchNote;
