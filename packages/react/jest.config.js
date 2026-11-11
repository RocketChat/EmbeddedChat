module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^react-syntax-highlighter/dist/esm/(.*)$':
      'react-syntax-highlighter/dist/cjs/$1',
    '^swiper/(.*)$': '<rootDir>/__mocks__/swiper.js',
  },
};
