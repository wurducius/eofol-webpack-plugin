const zlib = require("zlib")
const { promisify } = require("util")

const gzipPromise = promisify(zlib.gzip)

const gzipCompress = (input) =>
  gzipPromise(Buffer.from(input)).catch((err) => {
    console.error("Error during gzip compression:", err)
  })

module.exports = gzipCompress
