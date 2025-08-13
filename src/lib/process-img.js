const {
  promises: { readFile },
} = require("fs")
const sharp = require("sharp")
const svgo = require("svgo")

const IMAGE_PROCESSING_INCLUDE_METADATA = false

const jpegOptions = { quality: 25, mozjpeg: true, force: true }

const pngOptions = { compressionLevel: 9, quality: 60, effort: 10, adaptiveFiltering: true, force: true }

const gifOptions = { force: true }

const svgOptions = (filePath) => ({
  path: filePath,
  multipass: true,
})

const processGeneral = (callback) => (filePath) => {
  const data = callback(sharp(filePath))
  const processed = IMAGE_PROCESSING_INCLUDE_METADATA ? data.withMetadata() : data
  return processed.toBuffer()
}

const optimizeJpg = processGeneral((x) => x.jpeg(jpegOptions))

const optimizePng = processGeneral((x) => x.png(pngOptions))

const optimizeGif = processGeneral((x) => x.gif(gifOptions))

const optimizeSvg = (filePath) => {
  return readFile(filePath).then((content) => {
    return svgo.optimize(content.toString(), svgOptions(filePath)).data
  })
}

module.exports = { optimizePng, optimizeJpg, optimizeGif, optimizeSvg }
