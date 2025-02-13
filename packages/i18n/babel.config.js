module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          bugfixes: true,
          targets: { node: 'current' },
        },
      ],
    ],
  };
  