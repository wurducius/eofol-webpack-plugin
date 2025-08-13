const { SW_FILENAME } = require("../constants")
const { updateAsset } = require("../util")
const babel = require("@babel/core")

const babelOptions = {}

const babelifyImpl = (source) => babel.transform(source, babelOptions)

const babelify = (compilation, options) => {
  if (options.js.babelify) {
    return Promise.all(
      Object.keys(compilation.assets)
        .filter((filename) => filename.endsWith(".js") && filename !== SW_FILENAME)
        .map((filename) => {
          const source = compilation.assets[filename].source()
          const babelified = babelifyImpl(source.toString()).code
          updateAsset(compilation, filename, babelified)
        }),
    )
  } else {
    return new Promise((resolve) => resolve(true))
  }
}

module.exports = babelify
