const { minify } = require("html-minifier-terser")

const minifyOptions = {
  continueOnParseError: true,
  removeComments: true,
  minifyHTML: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  processScripts: true,
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
  collapseBooleanAttributes: true,
  noNewlinesBeforeTagClose: true,
  sortAttributes: true,
  sortClassName: true,
}

const minifyHtml = (res) =>
  minify(res, minifyOptions).catch((ex) => {
    //  console.log("Minify error", ex)
  })

module.exports = minifyHtml
