const { mapCombinator, injectBody } = require("../util")

const injectHtmlBody = (compilation, baseName, pageName, source, options) => {
  const { head: headJs, views: viewsJs, inline: inlineJs } = options.js
  const scriptName = `assets/js/${baseName}.js`
  const injectedScriptExternal = !inlineJs && !headJs ? `<script src="${scriptName}"></script>` : ""
  const jsContents = mapCombinator(viewsJs[pageName], (scriptAssetName) => compilation.assets[scriptAssetName].source())
  const injectedContent = options?.js?.injectJs[pageName] ? [...jsContents, options.js.injectJs[pageName]] : jsContents
  const injectedScriptInline = inlineJs ? `<script>${injectedContent.filter(Boolean).join(" ")}</script>` : ""
  const injectedBody = `${injectedScriptExternal}${injectedScriptInline}`
  return injectBody(source, injectedBody)
}

module.exports = injectHtmlBody
