const { join } = require("path")
const { readFileSync, readdirSync } = require("fs")
const { CWD, addAsset } = require("../util")

const injectViews = (compilation) => {
  readdirSync(join(CWD, "public"), { recursive: true })
    .filter((filename) => filename.endsWith(".html"))
    .forEach((pageName) => {
      const content = readFileSync(join(CWD, "public", pageName)).toString()
      addAsset(compilation, pageName, content, {}, false)
    })
}

module.exports = injectViews
