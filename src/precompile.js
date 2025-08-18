const { mapCombinator, readResource, replaceSep, replaceSepToDash, updateAsset } = require("./util")
const injectAssets = require("./lib/inject-assets")
const compileHtmlFromTemplate = require("./lib/html-template")
const injectHtmlHead = require("./lib/inject-head")
const injectHtmlBody = require("./lib/inject-body")
const babelify = require("./lib/babelify")
const injectViews = require("./lib/inject-views")
const createPages = require("./lib/create-pages")

const precompile = (_compiler, compilation, options) => {
  return injectViews(compilation).then(() => {
    createPages(compilation, options)
    compileHtmlFromTemplate(compilation, options)
    injectAssets(compilation, options)
    return babelify(compilation, options).then(() =>
      Promise.all(mapCombinator(options.css.shared, readResource)).then((sharedCssContent) =>
        Promise.all(
          Object.keys(options.css.views).map((pageName) => {
            const assetName = `${replaceSep(pageName)}.html`
            return Promise.all(mapCombinator(options.css.views[pageName], readResource)).then((contents) => {
              const source = compilation.assets[assetName].source()
              const baseName = replaceSepToDash(assetName).replace(".html", "")
              return injectHtmlHead(pageName, baseName, source, contents, sharedCssContent, options).then(
                (nextSourceHead) => {
                  const nextSource = injectHtmlBody(compilation, baseName, pageName, nextSourceHead, options)
                  updateAsset(compilation, assetName, nextSource)
                },
              )
            })
          }),
        ),
      ),
    )
  })
}

module.exports = precompile
