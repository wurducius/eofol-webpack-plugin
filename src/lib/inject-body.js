const { mapCombinator, injectBody } = require("../util")
const { errorOverlayHtmlTemplate } = require("./resources/error-overlay")
const swRegister = require("./sw-register")

const injectHtmlBody = (compilation, baseName, pageName, source, options) => {
  const { head: headJs, views: viewsJs, inline: inlineJs } = options.js
  const scriptName = `assets/js/${baseName}.js`
  const injectedScriptExternal = !inlineJs && !headJs ? `<script src="${scriptName}"></script>` : ""
  const jsContents = mapCombinator(viewsJs[pageName], (scriptAssetName) => compilation.assets[scriptAssetName].source())
  const injectedContent = options?.js?.injectJs[pageName] ? [...jsContents, options.js.injectJs[pageName]] : jsContents
  const withErrorOverlay = `${swRegister} ${errorOverlayHtmlTemplate(injectedContent.filter(Boolean).join(" "))}`
  const injectedScriptInline = inlineJs ? `<script>${withErrorOverlay}</script>` : ""
  const injectedBody = `${injectedScriptExternal}${injectedScriptInline}`
  return injectBody(source, injectedBody)
}

module.exports = injectHtmlBody
