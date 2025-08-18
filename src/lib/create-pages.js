const { addAsset } = require("../util")
const { helmetTemplate } = require("./resources/head")
const { htmlTemplate, doctype } = require("./resources/html-template")
const { baseHead } = require("./resources/head")

const createPages = (compilation, options) => {
  Object.keys(options.createPages).forEach((pageName) => {
    const data = options.createPages[pageName]
    let html = doctype
    const head = baseHead + data.head ? helmetTemplate(data.head) : ""
    if (data.template) {
      html = html + htmlTemplate(data.template, data.css, data.title ?? "Created page", data.js, head)
    }
    if (data.html) {
      html = html + data.html
    }
    addAsset(compilation, `${pageName}.html`, html, {}, false)
  })
}

module.exports = createPages
