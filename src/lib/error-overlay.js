const errorOverlayTop = `const headerMsg = "Eofol runtime error:";
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
try { `
const errorOverlayBottom = ` } catch (ex) {
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

module.exports = { errorOverlayTop, errorOverlayBottom }
