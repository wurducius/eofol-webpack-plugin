const { addAsset } = require("../util")
const { htmlTemplate, doctype } = require("./resources/html-template")
const sitemapStyles = require("./resources/sitemap")

const generateSitemap = (compilation, options) => {
  if (options.inject.sitemap) {
    const pages = Object.keys(compilation.assets).filter((assetName) => assetName.endsWith(".html"))
    const pageList = `<h1>Sitemap</h1><ul>${pages
      .map((pageName) => {
        const pageNameSplit = pageName.split(".")
        const pageNameDisplay = pageNameSplit
          .map((part, i) => (i !== pageNameSplit.length - 1 ? part : undefined))
          .filter(Boolean)
          .join(".")
          .replaceAll("\\", "/")
        return `<li><a href="${pageName}">${pageNameDisplay}</a></li>`
      })
      .join("")}</ul>`
    const source = doctype + htmlTemplate(pageList, sitemapStyles, "Sitemap")
    addAsset(compilation, "sitemap.html", source, {}, false)
  }
}

module.exports = generateSitemap
