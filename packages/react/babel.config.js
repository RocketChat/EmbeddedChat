const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      isTest
        ? { targets: { node: 'current' } }
        : {
            modules: false,
            bugfixes: true,
            targets: { browsers: '> 0.25%, ie 11, not op_mini all, not dead' },
          },
    ],
    '@babel/preset-react',
    ...(isTest ? [] : ['@emotion/babel-preset-css-prop']),
  ],
};
