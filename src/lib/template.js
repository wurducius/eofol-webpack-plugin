const { updateAsset, replaceSep } = require("../util")

const templateTop = '<html lang="en"><head></head><body>'
const templateBottom = "</body><noscript>You need to enable JavaScript to run this app.</noscript></html>"

const compileHtmlFromTemplate = (compilation, options) => {
  if (options.html.template.length > 0) {
    options.html.template.forEach((pageName) => {
      const assetName = replaceSep(pageName)
      const source = compilation.assets[assetName].source()
      const nextSource = `${templateTop}${source}${templateBottom}`
      updateAsset(compilation, assetName, nextSource)
    })
  }
}

module.exports = compileHtmlFromTemplate
