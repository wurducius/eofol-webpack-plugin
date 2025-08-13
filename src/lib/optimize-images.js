const { join } = require("path")
const { addAsset, CWD } = require("../util")
const { optimizePng, optimizeJpg, optimizeGif, optimizeSvg } = require("./process-img")

const optimizeIcons = (compilation) => {
  Object.keys(compilation.assets)
    .filter((filename) => filename.endsWith(".svg"))
    .forEach((filename) => {
      const nextSource = optimizeSvg(join(CWD, "public", filename))
      addAsset(compilation, filename, nextSource, {}, false)
    })
}

const optimizeImages = (compilation) =>
  Promise.all([
    ...Object.keys(compilation.assets)
      .filter((filename) => filename.endsWith(".png"))
      .map((filename) => {
        return optimizePng(join(CWD, "public", filename)).then((nextSource) => {
          addAsset(compilation, filename, nextSource, {}, false)
          return new Promise((resolve) => resolve(true))
        })
      }),
    ...Object.keys(compilation.assets)
      .filter((filename) => filename.endsWith(".jpg") || filename.endsWith(".jpeg"))
      .map((filename) => {
        return optimizeJpg(join(CWD, "public", filename)).then((nextSource) => {
          addAsset(compilation, filename, nextSource, {}, false)
          return new Promise((resolve) => resolve(true))
        })
      }),
    ...Object.keys(compilation.assets)
      .filter((filename) => filename.endsWith(".gif"))
      .map((filename) => {
        return optimizeGif(join(CWD, "public", filename)).then((nextSource) => {
          addAsset(compilation, filename, nextSource, {}, false)
          return new Promise((resolve) => resolve(true))
        })
      }),
  ])

const optimizeImagesAndIcons = (compilation) => {
  optimizeIcons(compilation)
  return optimizeImages(compilation)
}

module.exports = optimizeImagesAndIcons
