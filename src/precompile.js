const { sep, join } = require("path")
const fs = require("fs")
const {
  CWD,
  addAsset,
  mapCombinator,
  readResource,
  injectHead,
  injectBody,
  tag,
  logError,
  transformAsset,
  replaceSep,
  mergeDeep,
  updateAsset,
} = require("./util")
const { SW_FILENAME, SW_FILES_MARKER } = require("./constants")
const { readFileSync } = require("fs")
const babelify = require("./lib/babelify")
const injectFonts = require("./lib/inject-fonts")

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
const faviconContentDefault =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"><rect width="1000" height="1000" fill="#26d9d9" rx="200" ry="200"/><svg xmlns="http://www.w3.org/2000/svg" xmlns:svgjs="http://svgjs.com/svgjs" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" transform="matrix(8 0 0 8 100 100)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="100" height="100"><path d="M284.236 572.497v-52.593q-25.453 2.038-25.453 25.242 0 6.54 1.969 11.672 2.038 5.062 5.625 8.226a28.4 28.4 0 0 0 8.015 4.992q4.43 1.83 9.844 2.461m11.602 0q6.609-.632 11.46-2.672 4.923-2.038 7.524-4.57 2.601-2.602 4.148-6.187t1.899-6.47q.422-2.882.422-6.398 0-6.68-1.969-11.601-1.899-4.922-5.555-7.805a26.2 26.2 0 0 0-7.945-4.5q-4.359-1.616-9.984-2.18zm-11.602 4.149q-7.03-.492-12.797-2.04-5.695-1.546-9.492-3.585-3.726-2.11-6.61-4.922-2.812-2.813-4.359-5.414a28 28 0 0 1-2.39-5.555q-.915-2.954-1.196-4.922-.21-2.04-.21-4.008 0-3.585 1.124-7.312 1.195-3.726 4.008-7.594 2.813-3.938 6.89-7.031 4.149-3.165 10.618-5.485 6.468-2.32 14.414-3.023V510.2q0-3.375-1.828-4.851t-6.047-1.477h-3.797q-1.195 0-1.195-1.195v-2.672l.281-.281q12.515.28 18.14.281l18.563-.281.281.281v2.672q0 1.195-1.125 1.195h-3.796q-4.29 0-6.118 1.617-1.758 1.548-1.757 4.711v5.414q16.734 1.125 26.859 9.493 10.195 8.367 10.195 20.039 0 5.484-2.601 10.828-2.602 5.272-7.242 9.633-4.64 4.359-11.743 7.312-7.101 2.953-15.468 3.727v5.906q0 3.375 1.828 4.922 1.827 1.476 6.047 1.476h3.796q1.196 0 1.196 1.196v2.672l-.281.28q-12.516-.28-18.141-.28l-18.563.28-.28-.28v-2.672q0-1.196 1.124-1.196h3.797q4.219 0 6.047-1.617t1.828-4.781z" style="font-size:56px;font-style:normal;font-weight:400;text-align:center;line-height:125%;text-anchor:middle;fill:#000;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;font-family:Bitstream Vera Sans" transform="translate(-240.037 -496.411)"/></svg></svg></svg>'
const doctype = "<!DOCTYPE html>"
const templateTop = '<html lang="en"><head></head><body>'
const templateBottom = "</body><noscript>You need to enable JavaScript to run this app.</noscript></html>"
const baseHeader = '<meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport">'

// eslint-disable-next-line no-unused-vars
const manifestIconSizes = [
  { size: 48, title: "favicon" },
  { size: 192, title: "logo-sm" },
  { size: 320, title: "logo-md" },
  { size: 512, title: "logo-lg" },
]

const generateManifest = (data) => ({
  short_name: data.shortName ?? "short-name",
  name: data.name ?? "name",
  icons:
    data.icons && Array.isArray(data.icons)
      ? data.icons.map((icon) => ({
          src: icon.src,
          sizes: icon.sizes,
          type: icon.type ?? "image/png",
          purpose: icon.purpose ?? "any maskable",
        }))
      : [],
  start_url: data.startUrl ?? ".",
  display: data.display ?? "standalone",
  theme_color: data.themeColor ?? "#ff0000",
  background_color: data.bgColor ?? "#000000",
})

const helmetJsonDefault = {
  title: "title",
  theme: "#000000",
  description: "description",
}

const helmet = (data) =>
  `<link href="${data.imageSrc}" rel="icon"><link href="./manifest.json" rel="manifest"><meta content="${data.description}" name="description"><meta name="keywords" content="${data.keywords}"><meta content="${data.title}" property="og:title"><meta content="${data.imageType}" property="og:type"><meta content="${data.url}" property="og:url"><meta content="${data.imageSrc}" property="og:image"><meta content="${data.imageAlt}" property="og:image:alt"><link href="${data.imageSrc}" rel="apple-touch-icon"><meta content="${data.theme}" name="theme-color"><title>${data.title}</title>`

const compileHtmlFromTemplate = (compilation, options) => {
  if (options.html.template.length > 0) {
    options.html.template.forEach((pageName) => {
      const { source, finish } = transformAsset(compilation, replaceSep(pageName))
      const nextSource = `${templateTop}${source}${templateBottom}`
      finish(nextSource)
    })
  }
}

const injectDoctypeImpl = (compilation, options) => {
  if (options.html.injectDoctype || options.inject.errorOverlay) {
    Object.keys(compilation.assets)
      .filter((assetName) => assetName.endsWith(".html"))
      .forEach((pageName) => {
        if (options.html.injectDoctype) {
          const { source, finish } = transformAsset(compilation, pageName)
          const nextSource = `${doctype}${source}`
          finish(nextSource)
        }
      })
  }
}

const injectManifest = (compilation, options) => {
  if (options.inject.manifest) {
    const manifestJson = generateManifest({})
    addAsset(compilation, "manifest.json", JSON.stringify(manifestJson), {}, false)
    const faviconContent = faviconContentDefault
    addAsset(compilation, "favicon.ico", faviconContent, {}, false)
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
  Object.keys(options.inject.add).forEach((assetName) => {
    const path = options.inject.add[assetName]
    const content = fs.readFileSync(join(CWD, path))
    const arrBuffer = new Uint8Array(content)
    addAsset(compilation, assetName, arrBuffer.buffer, {}, false)
  })
}

const injectFontFile = (compilation, options) => {
  if (!options.font.inline) {
    const fontContent = readFileSync(join(CWD, options.font.path))
    const fontSplit = options.font.path.split("/")
    addAsset(compilation, join("assets", "media", "fonts", fontSplit[fontSplit.length - 1]), fontContent, {}, false)
  }
}

const injectAssets = (compilation, options) => {
  injectDoctypeImpl(compilation, options)
  injectManifest(compilation, options)
  injectRobots(compilation, options)
  injectSw(compilation, options)
  injectImgFallback(compilation, options)
  injectFontFile(compilation, options)
  addArbitraryAssets(compilation, options)
}

const injectHtmlHead = (baseName, source, contents, sharedCssContent, options) => {
  const { header } = options.html
  const { inline: inlineCss } = options.css
  const { inline: inlineJs, head: headJs } = options.js
  const scriptName = `assets/js/${baseName}.js`
  const stylesheetName = `assets/css/${baseName}.css`
  const injectedBaseHead = options.html.injectBaseHeader ? baseHeader : ""
  const injectedHeader = header ? helmet(mergeDeep(helmetJsonDefault, header)) : ""
  const injectedFontStyle = injectFonts(options.font)
  const injectedStyle = inlineCss
    ? tag("style", [...sharedCssContent, ...contents, injectedFontStyle].filter(Boolean).join(" "))
    : ""
  const injectedScript = !inlineJs && headJs ? `<script src="${scriptName}" async></script>` : ""
  const injectedStylesheet = !inlineCss ? `<link href="${stylesheetName}" rel="stylesheet" ></link>` : ""
  const injected = `${injectedScript}${injectedStylesheet}${injectedBaseHead}${injectedHeader}${injectedStyle}`
  return injectHead(source, injected)
}

const injectHtmlBody = (compilation, baseName, pageName, source, options) => {
  const { head: headJs, views: viewsJs, inline: inlineJs } = options.js
  const scriptName = `assets/js/${baseName}.js`
  const injectedScriptExternal = !inlineJs && !headJs ? `<script src="${scriptName}"></script>` : ""
  const jsContents = mapCombinator(viewsJs[pageName], (scriptAssetName) => compilation.assets[scriptAssetName].source())
  const injectedScriptInline = inlineJs ? `<script>${jsContents.filter(Boolean).join(" ")}</script>` : ""
  const injectedBody = `${injectedScriptExternal}${injectedScriptInline}`
  return injectBody(source, injectedBody)
}

const babelifyImpl = (compilation, options) => {
  if (options.js.babelify) {
    Object.keys(compilation.assets)
      .filter((filename) => filename.endsWith(".js") && filename !== SW_FILENAME)
      .map((filename) => {
        const source = compilation.assets[filename].source()
        const babelified = babelify(source.toString()).code
        updateAsset(compilation, filename, babelified)
      })
  }
}

const injectViews = (compilation) => {
  fs.readdirSync(join(CWD, "public"), { recursive: true })
    .filter((filename) => filename.endsWith(".html"))
    .forEach((pageName) => {
      const content = fs.readFileSync(join(CWD, "public", pageName)).toString()
      addAsset(compilation, pageName, content, {}, false)
    })
}

// and and remove assets
// create directories
const precompile = (_compiler, compilation, options) => {
  injectViews(compilation)

  // compile html from template
  compileHtmlFromTemplate(compilation, options)

  // inject doctype
  // inject error overlay (TODO)
  // inject manifest and favicon
  // inject robots
  // inject sw
  // inject image fallback
  injectAssets(compilation, options)

  babelifyImpl(compilation, options)

  // inject css
  // inject font
  // inject header
  // inject js
  const logErrorCssInline = logError("CSS inline")
  try {
    return Promise.all(mapCombinator(options.css.shared, readResource)).then((sharedCssContent) =>
      Promise.all(
        Object.keys(options.css.views).map((pageName) => {
          const assetName = `${replaceSep(pageName)}.html`
          return Promise.all(mapCombinator(options.css.views[pageName], readResource)).then((contents) => {
            const { source, finish } = transformAsset(compilation, assetName)
            const baseName = assetName.replaceAll(sep, "-").replace(".html", "")
            const nextSourceHead = injectHtmlHead(baseName, source, contents, sharedCssContent, options)
            const nextSource = injectHtmlBody(compilation, baseName, pageName, nextSourceHead, options)
            finish(nextSource)
          })
        }),
      ),
    )
  } catch (ex) {
    logErrorCssInline(ex)
    throw ex
  }
}

module.exports = precompile
