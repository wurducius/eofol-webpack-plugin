const errorOverlayHtmlTemplate = (content) => `const headerMsg = "Eofol runtime error:";
const appendDiv = (parent, innerHtml, style) => {
  const header = document.createElement("div")
  if (style) {
    header.className = style
  }
  if (innerHtml) {
    header.innerHTML = innerHtml
  }
  parent.appendChild(header)
  return header
}
try { ${content} } catch (ex) {
      const stacktraceMsg = ex.stack ? "Stacktrace: "+ex.stack : ""
      console.log(headerMsg+" "+ex.message + " - " +stacktraceMsg)
      const root = document.getElementById("root")
      if (root) {
        const container = appendDiv(root, undefined, "error-overlay-container")
        const padded = appendDiv(container, undefined, "error-overlay-padded error-overlay-padded-padding")
        appendDiv(padded, headerMsg, "error-overlay-header")
        appendDiv(padded, ex.message, "error-overlay-headerContent")
        appendDiv(padded, stacktraceMsg, "error-overlay-stacktrace")
      }
    }`

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
module.exports = { errorOverlayHtmlTemplate, errorOverlayStyles }
