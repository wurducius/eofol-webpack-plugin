const removeUnusedScripts = require("./lib/remove-unused-scripts")
const removeArbitraryAssets = require("./lib/remove-arbitrary-assets")
const injectSwInstallFiles = require("./lib/inject-sw-install-files")
const optimizeImagesAndIcons = require("./lib/optimize-images")
const minifyHtml = require("./lib/minify-html")
const compress = require("./lib/compress")

const optimizeAssets = (_compiler, compilation, options) => {
  removeUnusedScripts(compilation, options)
  removeArbitraryAssets(compilation, options)
  injectSwInstallFiles(compilation, options)
  return optimizeImagesAndIcons(compilation)
    .then(() => minifyHtml(compilation, options))
    .then(() => compress(compilation, options))
}

module.exports = optimizeAssets
