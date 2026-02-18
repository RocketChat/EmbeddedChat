export const formatter = [
  { name: 'bold', pattern: '*{{text}}*', tooltip: 'Bold' },
  { name: 'italic', pattern: '_{{text}}_', tooltip: 'Italic' },
  { name: 'strike', pattern: '~{{text}}~', tooltip: 'Strikethrough' },
  { name: 'code', pattern: '`{{text}}`', tooltip: 'Inline code' },
  {
    name: 'multiline',
    pattern: '```\n{{text}}\n```',
    tooltip: 'Multi-line code',
  },
  {
    name: 'list-numbers',
    type: 'list',
    listPrefix: (n) => `${n}. `,
    tooltip: 'Ordered list',
  },
  {
    name: 'list-bullets',
    type: 'list',
    listPrefix: () => '- ',
    tooltip: 'Unordered list',
  },
];
