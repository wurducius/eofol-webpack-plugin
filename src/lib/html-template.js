const { updateAsset, replaceSep } = require("../util")
const { htmlTemplate } = require("./resources/html-template")

const compileHtmlFromTemplate = (compilation, options) => {
  if (options.html.template.length > 0) {
    options.html.template.forEach((pageName) => {
      const assetName = replaceSep(pageName)
      const source = compilation.assets[assetName].source()
      const nextSource = htmlTemplate(source)
      updateAsset(compilation, assetName, nextSource)
    })
  }
}

module.exports = compileHtmlFromTemplate
