const { join } = require("path")
const {
  promises: { readFile, readdir },
} = require("fs")
const { CWD, addAsset } = require("../util")

const injectViews = (compilation) => {
  return readdir(join(CWD, "public"), { recursive: true }).then((dir) => {
    return Promise.all(
      dir
        .filter((filename) => filename.endsWith(".html"))
        .map((pageName) => {
          return readFile(join(CWD, "public", pageName)).then((content) => {
            addAsset(compilation, pageName, content.toString(), {}, false)
          })
        }),
    )
  })
}

module.exports = injectViews
