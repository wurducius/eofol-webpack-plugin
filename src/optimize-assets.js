const { addAsset } = require("./util")
const minifyHtml = require("./lib/minify-html")

// optimize images
// optimize icons
// minify
// compress
// babelize
const optimizeAssets = (_compiler, compilation, options) => {
  // const views = options.views
  // const shared = options.shared ?? []

  try {
    return new Promise((resolve) => resolve(true))
  } catch (ex) {
    console.error("Error during CSS inline: ", ex)
    throw ex
  }
}

module.exports = optimizeAssets
