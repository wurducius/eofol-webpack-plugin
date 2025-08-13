const { addAsset } = require("../util")
const pack = require("ico-packer")

const generateFavicon = (compilation) => {
  const iconContent = compilation.assets["assets/media/images/favicon.png"].source()
  const faviconContent = pack([iconContent])
  addAsset(compilation, "favicon.ico", faviconContent, {}, false)
}

module.exports = generateFavicon
