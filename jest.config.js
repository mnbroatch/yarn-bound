module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  clearMocks: true,
  transformIgnorePatterns: [
    '/node_modules/(?!@mnbroatch).+\\.js$'
  ]
}
