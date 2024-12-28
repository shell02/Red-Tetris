module.exports = {
  testEnvironment: 'jsdom', // For testing React apps
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transpile JS/JSX with Babel
  },
  moduleFileExtensions: ['js', 'jsx'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
};
