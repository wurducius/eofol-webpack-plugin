const { join } = require("path")
const {
  promises: { readFile },
} = require("fs")
const { CWD, addAsset, updateAsset, mapCombinator } = require("../util")
const { SW_FILENAME, SW_FILES_MARKER } = require("../constants")
const generateManifest = require("./generate-manifest")
const generateFavicon = require("./generate-favicon")

const doctype = "<!DOCTYPE html>"
const robotsContent = "User-agent: *\nAllow: /"
const swContent = `
let CACHE_NAME = "cache",
  CACHE_VERSION = "v1",
  cacheId = CACHE_NAME + "-" + CACHE_VERSION,
  urlsToCache = [${SW_FILES_MARKER}]

self.addEventListener("install", (s) => {
  s.waitUntil(caches.open(cacheId).then((s) => Promise.all(urlsToCache.map((e) => s.add(e)))))
})
`
const imgFallbackContent =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M44.2 76.086V23.492q-25.454 2.04-25.454 25.242 0 6.54 1.969 11.672 2.04 5.062 5.625 8.227a28.4 28.4 0 0 0 8.015 4.992q4.43 1.83 9.844 2.46m11.602 0q6.609-.631 11.46-2.67 4.923-2.04 7.524-4.571 2.601-2.602 4.149-6.188 1.546-3.586 1.898-6.468.422-2.883.422-6.399 0-6.68-1.969-11.601-1.898-4.922-5.555-7.805a26.2 26.2 0 0 0-7.945-4.5q-4.359-1.617-9.984-2.18zm-11.602 4.148q-7.03-.492-12.797-2.039-5.695-1.546-9.492-3.586-3.726-2.109-6.61-4.921-2.811-2.812-4.359-5.415a28 28 0 0 1-2.39-5.554q-.915-2.954-1.196-4.922-.21-2.04-.21-4.008 0-3.586 1.125-7.312 1.194-3.727 4.007-7.594 2.813-3.938 6.891-7.031 4.149-3.165 10.617-5.485T44.2 19.344v-5.555q0-3.375-1.828-4.851-1.828-1.477-6.047-1.477h-3.797q-1.195 0-1.195-1.195V3.594l.281-.281q12.516.28 18.14.28l18.563-.28.282.28v2.673q0 1.195-1.125 1.195h-3.797q-4.29 0-6.117 1.617Q55.8 10.625 55.8 13.79v5.414q16.734 1.125 26.86 9.492 10.194 8.367 10.194 20.04 0 5.484-2.601 10.828-2.602 5.273-7.242 9.632-4.641 4.36-11.742 7.313T55.8 80.234v5.907q0 3.375 1.829 4.922 1.828 1.476 6.047 1.476h3.797q1.195 0 1.195 1.195v2.672l-.281.282q-12.516-.282-18.14-.282l-18.563.282-.282-.282v-2.672q0-1.195 1.125-1.195h3.797q4.219 0 6.047-1.617T44.2 86.14z"/></svg>'

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
  return Promise.all([
    injectFontFile(compilation, options),
    addArbitraryAssets(compilation, options),
    injectManifest(compilation, options),
  ])
}

module.exports = injectAssets
