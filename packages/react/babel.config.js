module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: '@emotion/react',
        modules: false,
        bugfixes: true,
        targets: { browsers: '> 0.25%, ie 11, not op_mini all, not dead' },
      },
    ],
  ],
  plugins: ['@emotion/babel-plugin'],
};
