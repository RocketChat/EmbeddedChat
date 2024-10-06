const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const iconsList = [
  'file',
  'mobile',
  'star',
  'reply-directly',
  'hash',
  'computer',
  'cross',
  'mic',
  'circle-cross',
  'circle-check',
  'send',
  'emoji',
  'plus',
  'thread',
  'user',
  'clock',
  'back',
  'report',
  'info',
  'members',
  'link',
  'magnifier',
  'edit',
  'arrow-back',
  'google',
  'multiline',
  'code',
  'strike',
  'bold',
  'italic',
  'star-filled',
  'trash',
  'kebab',
  'check',
  'error-circle',
  'chevron-down',
  'chevron-left',
  'key',
  'quote',
  'at',
  'arrow-collapse',
  'arrow-expand',
  'cog',
];

const svgDirPath = path.join(
  __dirname,
  '../../../node_modules/@rocket.chat/icons/dist/svg'
);

const svgIconOutputDir = path.join(__dirname, '../src/components/Icon/icons');

const camelCase = (name) =>
  name
    .split('-')
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join('');

const codeModifier = (code) => {
  let newCode = code.replace(/class=/g, 'className=');
  const openingTag = newCode.match(/<svg.*>/g)[0];
  const newOpeningTag = openingTag.replace('>', ' {...props}>');
  newCode = newCode.replace(openingTag, newOpeningTag);
  return newCode;
};

const getComponentCode = (name, svgData) => `
    import React from 'react';

    const ${camelCase(name)} = (props) => (
      ${codeModifier(svgData)}
    )

    export default ${camelCase(name)};
  `;

if (!fs.existsSync(svgIconOutputDir)) {
  fs.mkdirSync(svgIconOutputDir, { recursive: true });
}
iconsList.forEach((icon) => {
  const svgIconPath = path.join(svgDirPath, `${icon}.svg`);
  const svgIconOutputPath = path.join(
    svgIconOutputDir,
    `${camelCase(icon)}.js`
  );
  const svgData = fs.readFileSync(svgIconPath).toString();
  const componentCode = getComponentCode(icon, svgData);
  fs.writeFileSync(svgIconOutputPath, componentCode);
});

execSync(`npx prettier --write '${svgIconOutputDir}' `);
