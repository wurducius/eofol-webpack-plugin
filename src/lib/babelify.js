const babel = require("@babel/core")

const babelOptions = {}

const babelify = (source) => babel.transformSync(source, babelOptions)

module.exports = babelify
