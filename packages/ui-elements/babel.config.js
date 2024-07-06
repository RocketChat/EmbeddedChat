module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        bugfixes: true,
        targets: { browsers: '> 0.25%, ie 11, not op_mini all, not dead' },
      },
    ],
    '@babel/preset-react',
    '@emotion/babel-preset-css-prop',
  ],
};
