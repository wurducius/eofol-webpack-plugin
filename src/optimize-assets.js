const { addAsset, updateAsset, mapCombinator, arrayCombinator } = require("./util")
const minifyHtmlImpl = require("./lib/minify-html")

const removeUnusedScripts = (compilation, viewsJs) => {
  arrayCombinator(Object.keys(viewsJs), (pageName) => {
    const scriptNames = viewsJs[pageName]
    arrayCombinator(scriptNames, (scriptName) => {
      if (compilation.assets[scriptName]) {
        delete compilation.assets[scriptName]
      }
    })
  })
}

const minify = (compilation) =>
  Promise.all(
    mapCombinator(
      Object.keys(compilation.assets).filter((assetName) => assetName.endsWith(".html")),
      (assetName) =>
        minifyHtmlImpl(compilation.assets[assetName].source()).then((minifiedContent) =>
          updateAsset(compilation, assetName, minifiedContent),
        ),
    ),
  )

// optimize images
// optimize icons
// minify
// compress
// babelize
const optimizeAssets = (_compiler, compilation, options) => {
  // const views = options.views
  // const shared = options.shared ?? []

  const { template, header, injectBaseHeader, injectDoctype, minify: minifyHtml, babelize } = options.html
  const {
    views,
    shared: sharedCss,
    injectViews: injectViewsCss,
    injectShared: injectSharedCss,
    inline: inlineCss,
    minify: minifyCss,
  } = options.css
  const { views: viewsJs, inline: inlineJs, minify: minifyJs, head: headJs } = options.js

  removeUnusedScripts(compilation, viewsJs)

  if (minifyHtml) {
    return minify(compilation)
  }

  try {
    return new Promise((resolve) => resolve(true))
  } catch (ex) {
    console.error("Error during CSS inline: ", ex)
    throw ex
  }
}

module.exports = optimizeAssets
