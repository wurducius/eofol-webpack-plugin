const { join } = require("path")
const {
  promises: { readFile },
} = require("fs")
const { CWD } = require("../util")

const bytesToBase64 = (bytes) => btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""))

const fontTemplate = (args, fontFilename, fontContent) => `@font-face {
              font-family: "${args.fontFamily}";
              font-style: ${args.fontStyle ?? "normal"};
              font-weight: ${args.fontWeight ?? "400"};
              font-display: ${args.fontDisplay ?? "swap"};
              src: ${!args.inline ? `url(./assets/media/fonts/${fontFilename})` : `url('data:font/${args.format}; base64,${bytesToBase64(Uint8Array.from(fontContent))}')`}
              format("${args.format}");
              }
              ${args.primary ? `body { font-family: ${args.fontFamily}${args.fontFamilyFallback ? `, ${args.fontFamilyFallback}` : ""}; font-size: 1rem; }` : ""}`

const injectFonts = (args) => {
  return readFile(join(CWD, args.path)).then((fontContent) => {
    const fontPathSplit = args.path.split("/")
    const fontFilename = fontPathSplit[fontPathSplit.length - 1]
    return fontTemplate(args, fontFilename, fontContent)
  })
}

module.exports = injectFonts
