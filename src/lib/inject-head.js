const { injectHead, tag } = require("../util")
const injectFonts = require("./inject-fonts")
const helmet = require("./helmet")

const baseHeader = '<meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport">'

const injectHtmlHead = (pageName, baseName, source, contents, sharedCssContent, options) => {
  const { header } = options.html
  const { inline: inlineCss } = options.css
  const { inline: inlineJs, head: headJs } = options.js
  const injectedContent = options?.css?.injectCss[pageName] ? [...contents, options.css.injectCss[pageName]] : contents
  const scriptName = `assets/js/${baseName}.js`
  const stylesheetName = `assets/css/${baseName}.css`
  const injectedBaseHead = options.html.injectBaseHeader ? baseHeader : ""
  const injectedHeader = header ? helmet(header) : ""
  const injectedFontStyle = Array.isArray(options.font)
    ? options.font.map((fontArgs) => injectFonts(fontArgs))
    : injectFonts({ ...options.font, primary: true })
  const injectedStyle = inlineCss
    ? tag("style", [...sharedCssContent, ...injectedContent, injectedFontStyle].filter(Boolean).join(" "))
    : ""
  const injectedScript = !inlineJs && headJs ? `<script src="${scriptName}" async></script>` : ""
  const injectedStylesheet = !inlineCss ? `<link href="${stylesheetName}" rel="stylesheet" ></link>` : ""
  const injected = `${injectedScript}${injectedStylesheet}${injectedBaseHead}${injectedHeader}${injectedStyle}`
  return injectHead(source, injected)
}

module.exports = injectHtmlHead
