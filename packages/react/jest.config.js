module.exports = {
  testEnvironment: 'jsdom',
  // Allow Jest to transform ESM packages that ship /dist/esm/ builds
  transformIgnorePatterns: [
    '/node_modules/(?!(react-syntax-highlighter)/)',
  ],
  moduleNameMapper: {
    // Silence CSS/asset imports that aren't relevant to unit tests
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};
