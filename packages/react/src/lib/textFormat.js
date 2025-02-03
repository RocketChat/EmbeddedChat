import i18n from '@embeddedchat/i18n';

export const formatter = [
  { name: 'bold', pattern: '*{{text}}*', tooltip: i18n.t('Tooltip_Bold') },
  { name: 'italic', pattern: '_{{text}}_', tooltip: i18n.t('Tooltip_Italic') },
  { name: 'strike', pattern: '~{{text}}~', tooltip: i18n.t('Tooltip_Strike') },
  { name: 'code', pattern: '`{{text}}`', tooltip: i18n.t('Tooltip_Inline') },
  {
    name: 'multiline',
    pattern: '```\n{{text}}\n```',
    tooltip: i18n.t('Tooltip_Multiline'),
  },
];
