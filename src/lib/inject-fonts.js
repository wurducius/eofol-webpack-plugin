const { join } = require("path")
const { readFileSync } = require("fs")
const { CWD } = require("../util")

const bytesToBase64 = (bytes) => btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""))

const injectFonts = (args) => {
  const fontContent = readFileSync(join(CWD, args.path))
  const fontPathSplit = args.path.split("/")
  const fontFilename = fontPathSplit[fontPathSplit.length - 1]
  return `@font-face {
              font-family: "${args.fontFamily}";
              font-style: ${args.fontStyle ?? "normal"};
              font-weight: ${args.fontWeight ?? "400"};
              font-display: ${args.fontDisplay ?? "swap"};
              src: ${!args.inline ? `url(./assets/media/fonts/${fontFilename})` : `url('data:font/${args.format}; base64,${bytesToBase64(Uint8Array.from(fontContent))}')`}
              format("${args.format}");
              }
              ${args.primary ? `body { font-family: ${args.fontFamily}${args.fontFamilyFallback ? `, ${args.fontFamilyFallback}` : ""}; font-size: 1rem; }` : ""}`
}

module.exports = injectFonts
