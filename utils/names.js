const changeCase = require('change-case')

module.exports = {
  toComponentName(str) {
    return changeCase.paramCase(str)
  },
  toComponentClassName(str) {
    return changeCase.pascalCase(str)
  },
  toRouteId(str) {
    return changeCase.camelCase(str)
  },
  capitalize(str) {
    return changeCase.upperCaseFirst(str)
  }
}