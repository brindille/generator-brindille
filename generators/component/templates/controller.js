module.exports = {
  data: () => {
    return new Promise(resolve => {
      resolve({
        hello: 'world'
      })
    })
  }
}
