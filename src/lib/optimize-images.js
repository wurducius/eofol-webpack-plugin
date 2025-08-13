const { join } = require("path")
const { addAsset, CWD } = require("../util")
const { optimizePng, optimizeJpg, optimizeGif, optimizeSvg } = require("./process-img")

const optimizeIcons = (compilation) => {
  return Promise.all(
    Object.keys(compilation.assets)
      .filter((filename) => filename.endsWith(".svg"))
      .map((filename) => {
        return optimizeSvg(join(CWD, "public", filename)).then((nextSource) => {
          addAsset(compilation, filename, nextSource, {}, false)
        })
      }),
  )
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
  return Promise.all([optimizeImages(compilation), optimizeIcons(compilation)])
}

module.exports = optimizeImagesAndIcons
