const { join } = require("path")
const {
  promises: { readFile },
} = require("fs")
const { CWD, addAsset, updateAsset, mapCombinator } = require("../util")
const { SW_FILENAME } = require("../constants")
const generateManifest = require("./generate-manifest")
const generateFavicon = require("./generate-favicon")
const { robotsContent, swContent, skeletonContent, imgFallbackContent } = require("./resources/external")
const { doctype } = require("./resources/html-template")

const injectDoctypeImpl = (compilation, options) => {
  if (options.html.injectDoctype || options.inject.errorOverlay) {
    Object.keys(compilation.assets)
      .filter((assetName) => assetName.endsWith(".html"))
      .forEach((pageName) => {
        if (options.html.injectDoctype) {
          const source = compilation.assets[pageName].source()
          const nextSource = `${doctype}${source}`
          updateAsset(compilation, pageName, nextSource)
        }
      })
  }
}

const injectManifest = (compilation, options) => {
  if (options.inject.manifest) {
    return generateManifest(compilation, options).then((generatedManifest) => {
      addAsset(compilation, "manifest.json", JSON.stringify(generatedManifest), {}, false)
      return generateFavicon(compilation)
    })
  } else {
    return Promise.resolve()
  }
}

const injectRobots = (compilation, options) => {
  if (options.inject.robots) {
    addAsset(compilation, "robots.txt", robotsContent, {}, false)
  }
}

const injectSw = (compilation, options) => {
  if (options.inject.sw) {
    addAsset(compilation, SW_FILENAME, swContent, {}, false)
  }
}

const injectImgFallback = (compilation, options) => {
  if (options.media.injectImageFallback) {
    addAsset(compilation, "img-fallback.svg", imgFallbackContent, {}, false)
  }
}

const injectImgSkeleton = (compilation, options) => {
  if (options.media.injectImageSkeleton) {
    addAsset(compilation, "skeleton.svg", skeletonContent, {}, false)
  }
}

const addArbitraryAssets = (compilation, options) => {
  return Promise.all(
    Object.keys(options.inject.add).map((assetName) => {
      const path = options.inject.add[assetName]
      return readFile(join(CWD, path)).then((content) => {
        const arrBuffer = new Uint8Array(content)
        addAsset(compilation, assetName, arrBuffer.buffer, {}, false)
      })
    }),
  )
}

const injectFontFile = (compilation, options) => {
  return Promise.all(
    mapCombinator(options.font, (fontArgs) => {
      if (!fontArgs.inline) {
        readFile(join(CWD, options.font.path)).then((fontContent) => {
          const fontSplit = fontArgs.path.split("/")
          addAsset(
            compilation,
            join("assets", "media", "fonts", fontSplit[fontSplit.length - 1]),
            fontContent,
            {},
            false,
          )
        })
      }
    }),
  )
}

const injectAssets = (compilation, options) => {
  injectDoctypeImpl(compilation, options)
  injectRobots(compilation, options)
  injectSw(compilation, options)
  injectImgFallback(compilation, options)
  injectImgSkeleton(compilation, options)
  return Promise.all([
    injectFontFile(compilation, options),
    addArbitraryAssets(compilation, options),
    injectManifest(compilation, options),
  ])
}

module.exports = injectAssets
