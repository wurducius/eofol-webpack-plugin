const { transformAsset, replaceSep } = require("../util")

const templateTop = '<html lang="en"><head></head><body>'
const templateBottom = "</body><noscript>You need to enable JavaScript to run this app.</noscript></html>"

const compileHtmlFromTemplate = (compilation, options) => {
  if (options.html.template.length > 0) {
    options.html.template.forEach((pageName) => {
      const { source, finish } = transformAsset(compilation, replaceSep(pageName))
      const nextSource = `${templateTop}${source}${templateBottom}`
      finish(nextSource)
    })
  }
}

module.exports = compileHtmlFromTemplate
