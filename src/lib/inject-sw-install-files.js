const { addAsset, replaceSepToHtml } = require("../util")
const { SW_FILENAME, SW_FILES_MARKER } = require("../constants")

const injectSwInstallFiles = (compilation, options) => {
  if (options.inject.sw) {
    const swContent = compilation.assets[SW_FILENAME]
    const swAssets = Object.keys(compilation.assets)
    const swFiles = swAssets.filter((filename) => filename !== SW_FILENAME).map(replaceSepToHtml)
    const swInject = `"${swFiles.join('", "')}"`
    const nextSource = swContent.source().replaceAll(SW_FILES_MARKER, swInject)
    addAsset(compilation, SW_FILENAME, nextSource, {}, true)
  }
}

module.exports = injectSwInstallFiles
