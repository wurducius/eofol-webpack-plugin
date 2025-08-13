const { injectHead, tag } = require("../util")
const injectFonts = require("./inject-fonts")
const helmet = require("./helmet")

const baseHeader = '<meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport">'

const errorOverlayStyles = `
:root {
    --ERROR_OVERLAY_BG_COLOR: #000000;
    --ERROR_OVERLAY_FONT_COLOR: #f70e0eff;
    --ERROR_OVERLAY_HEADER_FONT_SIZE: 24px;
    --ERROR_OVERLAY_STACKTRACE_FONT_SIZE: 16px;
    --ERROR_OVERLAY_CONTAINER_WIDTH: 640px;
    --ERROR_OVERLAY_CONTAINER_PADDING: 64px;
    --ERROR_OVERLAY_CONTAINER_PADDING_SMALL: 16px;
    --ERROR_OVERLAY_HEADER_MARGIN: 32px;
    --ERROR_OVERLAY_HEADER_CONTENT_FONT_WEIGHT: 700;
}

.error-overlay-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--ERROR_OVERLAY_BG_COLOR);
    color: var(--ERROR_OVERLAY_FONT_COLOR);
    height: 100%;
    overflow: auto;
}

.error-overlay-padded {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: var(--ERROR_OVERLAY_CONTAINER_WIDTH);
    margin: 0 auto 0 auto;
}

@media (max-width: 400px) {
    .error-overlay-padded-padding {
        padding: 0 0;
    }
}

@media (max-width: 639px) and (min-width: 401px) {
    .error-overlay-padded-padding {
        padding: var(--ERROR_OVERLAY_CONTAINER_PADDING_SMALL) var(--ERROR_OVERLAY_CONTAINER_PADDING_SMALL);
    }
}

@media (min-width: 640px) {
    .error-overlay-padded-padding {
        padding: var(--ERROR_OVERLAY_CONTAINER_PADDING) var(--ERROR_OVERLAY_CONTAINER_PADDING);
    }
}

.error-overlay-header {
    font-size: var(--ERROR_OVERLAY_HEADER_FONT_SIZE);
    margin-bottom: var(--ERROR_OVERLAY_HEADER_MARGIN);
}

.error-overlay-headerContent {
    font-size: var(--ERROR_OVERLAY_HEADER_FONT_SIZE);
    margin-bottom: var(--ERROR_OVERLAY_HEADER_MARGIN);
    font-weight: var(--ERROR_OVERLAY_HEADER_CONTENT_FONT_WEIGHT);
}

.error-overlay-stacktrace {
    font-size: var(--ERROR_OVERLAY_STACKTRACE_FONT_SIZE);
}
`

const injectHtmlHead = (pageName, baseName, source, contents, sharedCssContent, options) => {
  const { header } = options.html
  const { inline: inlineCss } = options.css
  const { inline: inlineJs, head: headJs } = options.js
  const injectedContent = options?.css?.injectCss[pageName] ? [...contents, options.css.injectCss[pageName]] : contents
  const scriptName = `assets/js/${baseName}.js`
  const stylesheetName = `assets/css/${baseName}.css`
  const injectedBaseHead = options.html.injectBaseHeader ? baseHeader : ""
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
    const injected = `${injectedScript}${injectedStylesheet}${injectedBaseHead}${injectedHeader}${injectedStyle}`
    return injectHead(source, injected)
  })
}

module.exports = injectHtmlHead
