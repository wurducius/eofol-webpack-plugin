// const fs = require("fs")
const { join } = require("path")
const { addAsset, updateAsset, mapCombinator, arrayCombinator, CWD, replaceSepToHtml } = require("./util")
const { SW_FILENAME, SW_FILES_MARKER } = require("./constants")
const minifyHtmlImpl = require("./lib/minify-html")
const { optimizePng, optimizeJpg, optimizeGif, optimizeSvg } = require("./lib/process-img")

const removeUnusedScripts = (compilation, options) => {
  if (options.js.inline) {
    arrayCombinator(Object.keys(options.js.views), (pageName) => {
      const scriptNames = options.js.views[pageName]
      arrayCombinator(scriptNames, (scriptName) => {
        if (compilation.assets[scriptName]) {
          delete compilation.assets[scriptName]
        }
      })
    })
  }
}

const injectSwInstallFiles = (compilation, options) => {
  if (options.inject.sw) {
    const swContent = compilation.assets[SW_FILENAME]
    const swAssets = Object.keys(compilation.assets)

    /*
    return fs.promises.readdir(publicPath, { recursive: true }).then((dir) => {
      const swFiles = [...swAssets, ...dir.filter((file) => file.includes("."))].map(replaceSep)
      const swInject = `"${swFiles.join('", "')}"`
      const nextSource = swContent.toString().replaceAll(SW_FILES_MARKER, swInject)
      updateAsset(compilation, SW_FILENAME, nextSource)
    })
    */

    const swFiles = swAssets.filter((filename) => filename !== SW_FILENAME).map(replaceSepToHtml)
    const swInject = `"${swFiles.join('", "')}"`
    const nextSource = swContent.source().replaceAll(SW_FILES_MARKER, swInject)
    // Use updateAsset preferably
    addAsset(compilation, SW_FILENAME, nextSource, {}, true)
    return new Promise((resolve) => resolve(true))
  } else {
    return new Promise((resolve) => resolve(true))
  }

  return new Promise((resolve) => resolve(true))
}

const optimizeImages = (compilation) => {
  return Promise.all([
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
    ...Object.keys(compilation.assets)
      .filter((filename) => filename.endsWith(".svg"))
      .map((filename) => {
        const nextSource = optimizeSvg(join(CWD, "public", filename))
        addAsset(compilation, filename, nextSource, {}, false)
        return new Promise((resolve) => resolve(true))
      }),
  ])
}

const minify = (compilation, options) => {
  if (options.html.minify) {
    return Promise.all(
      mapCombinator(
        Object.keys(compilation.assets).filter((assetName) => assetName.endsWith(".html")),
        (assetName) =>
          minifyHtmlImpl(compilation.assets[assetName].source()).then((minifiedContent) =>
            updateAsset(compilation, assetName, minifiedContent),
          ),
      ),
    )
  } else {
    return new Promise((resolve) => resolve(true))
  }
}

// optimize images
// optimize icons
// minify
// compress
// babelize
const optimizeAssets = (_compiler, compilation, options) => {
  // const views = options.views
  // const shared = options.shared ?? []

  const { template, header, injectBaseHeader, injectDoctype, minify: minifyHtml, babelize } = options.html
  const {
    views,
    shared: sharedCss,
    injectViews: injectViewsCss,
    injectShared: injectSharedCss,
    inline: inlineCss,
    minify: minifyCss,
  } = options.css
  const { views: viewsJs, inline: inlineJs, minify: minifyJs, head: headJs } = options.js
  const { manifest, robots, sw, errorOverlay, add, remove } = options.inject

  removeUnusedScripts(compilation, options)
  return injectSwInstallFiles(compilation, options)
    .then(() => optimizeImages(compilation))
    .then(() => minify(compilation, options))
}

module.exports = optimizeAssets
