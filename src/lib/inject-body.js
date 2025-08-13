const { mapCombinator, injectBody } = require("../util")
const { errorOverlayBottom, errorOverlayTop } = require("./error-overlay")

const injectHtmlBody = (compilation, baseName, pageName, source, options) => {
  const { head: headJs, views: viewsJs, inline: inlineJs } = options.js
  const scriptName = `assets/js/${baseName}.js`
  const injectedScriptExternal = !inlineJs && !headJs ? `<script src="${scriptName}"></script>` : ""
  const jsContents = mapCombinator(viewsJs[pageName], (scriptAssetName) => compilation.assets[scriptAssetName].source())
  const injectedContent = options?.js?.injectJs[pageName] ? [...jsContents, options.js.injectJs[pageName]] : jsContents
  const withErrorOverlay = `${errorOverlayTop}${injectedContent.filter(Boolean).join(" ")}${errorOverlayBottom}`
  const injectedScriptInline = inlineJs ? `<script>${withErrorOverlay}</script>` : ""
  const injectedBody = `${injectedScriptExternal}${injectedScriptInline}`
  return injectBody(source, injectedBody)
}

module.exports = injectHtmlBody
