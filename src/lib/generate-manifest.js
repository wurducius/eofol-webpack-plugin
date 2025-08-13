const { join } = require("path")
const sharp = require("sharp")
const { addAsset, CWD } = require("../util")

const manifestIconSizes = [
  { size: 48, title: "favicon" },
  { size: 192, title: "logo-sm" },
  { size: 320, title: "logo-md" },
  { size: 512, title: "logo-lg" },
]

const generateManifest = (compilation, options) => {
  const { shortName, name, startUrl, display, bgColor } = options.manifest
  const { icon, theme } = options

  const iconSplit = icon.split(".")
  const iconExt = iconSplit[iconSplit.length - 1]
  const iconType = `image/${iconExt}`
  const parsedIcon = sharp(join(CWD, icon))

  return Promise.all(
    manifestIconSizes.map((item) =>
      parsedIcon
        .resize({ width: item.size, height: item.size })
        .toBuffer()
        .then((content) => {
          const src = `assets/media/images/${item.title}.${iconExt}`
          addAsset(compilation, src, content, {}, false)

          return {
            sizes: `${item.size}x${item.size}`,
            type: iconType,
            purpose: "any maskable",
            src: `./${src}`,
          }
        }),
    ),
  ).then((icons) => ({
    short_name: shortName,
    name,
    icons,
    start_url: startUrl,
    display,
    theme_color: theme,
    background_color: bgColor,
  }))
}

module.exports = generateManifest
