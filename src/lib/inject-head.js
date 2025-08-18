const { injectHead, tag } = require("../util")
const injectFonts = require("./inject-fonts")
const helmet = require("./helmet")
const { errorOverlayStyles } = require("./resources/error-overlay")
const resourceHint = require("./resource-hint")
const { baseHead } = require("./resources/head")

const injectHtmlHead = (pageName, baseName, source, contents, sharedCssContent, options) => {
  const { header } = options.html
  const { inline: inlineCss } = options.css
  const { inline: inlineJs, head: headJs } = options.js

  const injectedContent = options?.css?.injectCss[pageName] ? [...contents, options.css.injectCss[pageName]] : contents
  const scriptName = `assets/js/${baseName}.js`
  const stylesheetName = `assets/css/${baseName}.css`
  const injectedBaseHead = options.html.injectBaseHeader ? baseHead : ""
  const injectedHeader = header ? helmet(header) : ""
  return (
    Array.isArray(options.font)
      ? Promise.all(options.font.map((fontArgs) => injectFonts(fontArgs)))
      : injectFonts({ ...options.font, primary: true })
  ).then((injectedFontStyle) => {
    const injectedStyle = inlineCss
      ? tag(
          "style",
          [...sharedCssContent, ...injectedContent, injectedFontStyle, errorOverlayStyles].filter(Boolean).join(" "),
        )
      : ""
    const injectedScript = !inlineJs && headJs ? `<script src="${scriptName}" async></script>` : ""
    const injectedStylesheet = !inlineCss ? `<link href="${stylesheetName}" rel="stylesheet" ></link>` : ""
    const hints = resourceHint(options)

    const injected = `${injectedScript}${injectedStylesheet}${injectedBaseHead}${injectedHeader}${hints}${injectedStyle}`
    return injectHead(source, injected)
  })
}

module.exports = injectHtmlHead
