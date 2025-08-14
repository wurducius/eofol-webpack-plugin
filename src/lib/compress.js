const gzipCompress = require("./gzip")
const brotliCompress = require("./brotli")
const { addAsset } = require("../util")

const compress = (compilation, options) => {
  const compressed = {}
  return Promise.all(
    Object.keys(compilation.assets)
      .filter(
        (assetName) =>
          assetName != "service-worker.js" &&
          assetName != "robots.txt" &&
          assetName != "manifest.json" &&
          assetName != "favicon.ico" &&
          !assetName.endsWith(".png") &&
          !assetName.endsWith(".gif") &&
          !assetName.endsWith(".jpg") &&
          !assetName.endsWith(".jpeg") &&
          !assetName.endsWith(".woff") &&
          !assetName.endsWith(".woff2"),
      )
      .map((assetName) => {
        if (!assetName.endsWith(".gz")) {
          const source = compilation.assets[assetName].source()
          return assetName.endsWith(".gz") || assetName.endsWith(".br")
            ? Promise.resolve()
            : Promise.all(
                [
                  options.compression.gzip
                    ? gzipCompress(source).then((gzipped) => {
                        compressed[`${assetName}.gz`] = gzipped
                      })
                    : undefined,
                  options.compression.brotli
                    ? brotliCompress(source).then((brotlied) => {
                        compressed[`${assetName}.br`] = brotlied
                      })
                    : undefined,
                ].filter(Boolean),
              )
        }
      }),
  ).then(() => {
    Object.keys(compressed).forEach((assetName) => {
      addAsset(compilation, assetName, compressed[assetName], {}, false)
    })
  })
}

module.exports = compress
