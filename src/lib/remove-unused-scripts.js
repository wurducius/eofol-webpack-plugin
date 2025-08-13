const { arrayCombinator } = require("../util")

const removeUnusedScripts = (compilation, options) => {
  if (options.js.inline) {
    arrayCombinator(Object.keys(options.js.views), (pageName) => {
      const scriptNames = options.js.views[pageName]
      arrayCombinator(scriptNames, (scriptName) => {
        if (compilation.assets[scriptName]) {
          delete compilation.assets[scriptName]
        }
      })
    })
  }
}

module.exports = removeUnusedScripts
