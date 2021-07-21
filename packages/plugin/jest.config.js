const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  transform: {
    '^.+\\.[t|j]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node'
}
