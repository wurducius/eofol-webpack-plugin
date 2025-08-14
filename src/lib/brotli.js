const { compress } = require("brotli-compress")

const brotliOptions = { quality: 11 }

const brotliCompress = (data) => compress(data, brotliOptions)

module.exports = brotliCompress
