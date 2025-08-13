const { mapCombinator, readResource, replaceSep, replaceSepToDash, updateAsset } = require("./util")
const injectAssets = require("./lib/inject-assets")
const compileHtmlFromTemplate = require("./lib/template")
const injectHtmlHead = require("./lib/inject-head")
const injectHtmlBody = require("./lib/inject-body")
const babelify = require("./lib/babelify")
const injectViews = require("./lib/inject-views")

const precompile = (_compiler, compilation, options) => {
  injectViews(compilation)
  compileHtmlFromTemplate(compilation, options)
  injectAssets(compilation, options)
  babelify(compilation, options)
  return Promise.all(mapCombinator(options.css.shared, readResource)).then((sharedCssContent) =>
    Promise.all(
      Object.keys(options.css.views).map((pageName) => {
        const assetName = `${replaceSep(pageName)}.html`
        return Promise.all(mapCombinator(options.css.views[pageName], readResource)).then((contents) => {
          const source = compilation.assets[assetName].source()
          const baseName = replaceSepToDash(assetName).replace(".html", "")
          const nextSourceHead = injectHtmlHead(pageName, baseName, source, contents, sharedCssContent, options)
          const nextSource = injectHtmlBody(compilation, baseName, pageName, nextSourceHead, options)
          updateAsset(compilation, assetName, nextSource)
        })
      }),
    ),
  )
}

module.exports = precompile
