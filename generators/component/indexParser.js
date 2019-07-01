module.exports = function indexParser (content) {
  let components
  content.replace(/componentManager.registerMultiple\(\{([\s\S]+)\}\)/g, (match, list) => {
    components = list.trim().replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').replace(/\n| /gm, '').split(',')
  })
  return components
}