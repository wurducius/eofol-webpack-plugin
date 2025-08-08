const {
  addAsset,
  mapCombinator,
  readResource,
  injectHead,
  tag,
  logError,
  transformAsset,
  replaceSep,
} = require("./util")

const robotsContent = "User-agent: *\nDisallow: /"
const swContent = ""
const imgFallbackContent = ""

// inject font
// inject js
// inject header

// and and remove assets
// create directories
const precompile = (_compiler, compilation, options) => {
  const { template, header, injectBaseHeader, injectDoctype, minify: minifyHtml, babelize } = options.html
  const { views, shared: sharedCss, injectViews, injectShared, inline: inlineCss, minify: minifyCss } = options.css
  const {} = options.font
  const { inline: inlineJs, minify: minifyJs } = options.js
  const { optimizeImages, optimizeIcons, injectImageFallback } = options.media
  const { manifest, robots, sw, errorOverlay, add, remove } = options.inject

  // compile html from template
  if (template.length > 0) {
    template.forEach((pageName) => {
      const { source, finish } = transformAsset(compilation, pageName)
      finish(
        `<html><head></head><body>${source}</body><noscript>You need to enable JavaScript to run this app.</noscript></html>`,
      )
    })
  }

  // inject doctype
  // inject error overlay (TODO)
  if (injectDoctype || errorOverlay) {
    Object.keys(compilation.assets)
      .filter((assetName) => assetName.endsWith(".html"))
      .forEach((pageName) => {
        if (injectDoctype) {
          const { source, finish } = transformAsset(compilation, pageName)
          finish(`<!DOCTYPE html>${source}`)
        }
      })
  }

  // inject manifest and favicon
  if (manifest) {
    const manifestJson = {}
    addAsset(compilation, "manifest.json", JSON.stringify(manifestJson), {}, false)
    const faviconContent = ""
    addAsset(compilation, "favicon.ico", faviconContent, {}, false)
  }

  // inject robots
  if (robots) {
    addAsset(compilation, "robots.txt", robotsContent, {}, false)
  }

  // inject sw
  if (sw) {
    addAsset(compilation, "service-worker.js", swContent, {}, false)
  }

  // inject image fallback
  if (injectImageFallback) {
    addAsset(compilation, "img-fallback.png", imgFallbackContent, {}, false)
  }

  // inject css
  const logErrorCssInline = logError("CSS inline")
  try {
    return Promise.all(mapCombinator(sharedCss, readResource)).then((sharedCssContent) =>
      Object.keys(views).forEach((pageName) => {
        const assetName = replaceSep(pageName) + ".html"
        return Promise.all(mapCombinator(views[pageName], readResource)).then((contents) => {
          const { source, finish } = transformAsset(compilation, assetName)
          finish(injectHead(source, tag("style", [...contents, ...sharedCssContent].filter(Boolean).join(" "))))
        })
      }),
    )
  } catch (ex) {
    logErrorCssInline(ex)
    throw ex
  }
}

module.exports = precompile
