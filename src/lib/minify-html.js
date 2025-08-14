const { minify: minifyHtmlTerser } = require("html-minifier-terser")
const { updateAsset, mapCombinator } = require("../util")

const minifyHtmlOptions = {
  continueOnParseError: true,
  removeComments: true,
  minifyHTML: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  processScripts: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  collapseBooleanAttributes: true,
  noNewlinesBeforeTagClose: true,
  sortAttributes: true,
  sortClassName: true,
}

const minifyHtmlImpl = (res) =>
  minifyHtmlTerser(res, minifyHtmlOptions).catch((ex) => {
    console.log("Minify error", ex)
  })

const minifyHtml = (compilation, options) => {
  if (options.html.minify) {
    return Promise.all(
      mapCombinator(
        Object.keys(compilation.assets).filter((assetName) => assetName.endsWith(".html")),
        (assetName) =>
          minifyHtmlImpl(compilation.assets[assetName].source()).then((minifiedContent) =>
            updateAsset(compilation, assetName, minifiedContent),
          ),
      ),
    )
  } else {
    return Promise.resolve()
  }
}

module.exports = minifyHtml
