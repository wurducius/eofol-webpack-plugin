const removeUnusedScripts = require("./lib/remove-unused-scripts")
const removeArbitraryAssets = require("./lib/remove-arbitrary-assets")
const injectSwInstallFiles = require("./lib/inject-sw-install-files")
const optimizeImages = require("./lib/optimize-images")
const minifyHtml = require("./lib/minify-html")

const optimizeAssets = (_compiler, compilation, options) => {
  removeUnusedScripts(compilation, options)
  removeArbitraryAssets(compilation, options)
  injectSwInstallFiles(compilation, options)
  return optimizeImages(compilation).then(() => minifyHtml(compilation, options))
}

module.exports = optimizeAssets
