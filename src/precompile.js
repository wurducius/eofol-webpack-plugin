const { sep } = require("path")
const { mapCombinator, readResource, transformAsset, replaceSep } = require("./util")
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
          const { source, finish } = transformAsset(compilation, assetName)
          const baseName = assetName.replaceAll(sep, "-").replace(".html", "")
          const nextSourceHead = injectHtmlHead(pageName, baseName, source, contents, sharedCssContent, options)
          const nextSource = injectHtmlBody(compilation, baseName, pageName, nextSourceHead, options)
          finish(nextSource)
        })
      }),
    ),
  )
}

module.exports = precompile
