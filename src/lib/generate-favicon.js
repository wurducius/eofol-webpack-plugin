const { addAsset } = require("../util")
const toIco = require("to-ico")

const generateFavicon = (compilation) => {
  const iconContent = compilation.assets["assets/media/images/favicon.png"].source()
  return toIco([iconContent]).then((buffer) => {
    addAsset(compilation, "favicon.ico", buffer, {}, false)
  })
}

module.exports = generateFavicon
