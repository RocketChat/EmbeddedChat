module.exports = (api) => {
  // Jest needs CommonJS; the rollup build must keep native ES modules.
  const isTest = api.env('test');
  api.cache.using(() => isTest);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'commonjs' : false,
          bugfixes: true,
          targets: { browsers: '> 0.25%, ie 11, not op_mini all, not dead' },
        },
      ],
      '@babel/preset-react',
      '@emotion/babel-preset-css-prop',
    ],
  };
};
