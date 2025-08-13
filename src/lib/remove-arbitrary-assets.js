const removeArbitraryAssets = (compilation, options) => {
  if (options.inject.remove && options.inject.remove.length > 0) {
    options.inject.remove.array.forEach((assetName) => {
      if (compilation.assets[assetName]) {
        delete compilation.assets[assetName]
      }
    })
  }
}

module.exports = removeArbitraryAssets
