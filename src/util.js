const path = require("path")
const fs = require("fs")

const CWD = process.cwd()
const tagHeadEnd = "</head>"

const PLUGIN_NAME = "Eofol webpack plugin"

const getAsset = ({ asset, nextSource, nextSize, nextInfo }) => {
  const map = asset ? asset.map() : null
  return {
    source: () => nextSource,
    map: () => map,
    sourceAndMap: () => ({
      source: nextSource,
      map,
    }),
    size: () => nextSize,
    info: nextInfo,
  }
}

const addAsset = (compilation, assetName, nextSource, info, merge) => {
  compilation.assets[assetName] = getAsset({
    ...(merge ? compilation.assets[assetName] : {}),
    nextSource,
    nextInfo: info ?? {},
    nextSize: nextSource.length,
  })
}

const transformAsset = (compilation, assetName) => {
  const asset = compilation.assets[assetName]
  const source = asset.source()
  const finish = (nextSource) => {
    addAsset(compilation, assetName, nextSource, asset.info, true)
  }
  return { assetName, asset, source, finish }
}

const mapCombinator = (items, mapper) => {
  if (Array.isArray(items)) {
    return items.map(mapper)
  } else if (items) {
    return [mapper(items)]
  } else {
    return undefined
  }
}

const mergeDeep = (...objects) => {
  const isObject = (obj) => obj && typeof obj === "object"
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]
      const oVal = obj[key]
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = oVal ?? pVal
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })
    return prev
  }, {})
}

const readResource = (styleName) => {
  const filename = path.resolve(CWD, styleName)
  const exists = fs.existsSync(filename)
  if (!exists) {
    throw new Error(`File not found: ${styleName}`)
  }
  return fs.promises.readFile(filename, "utf-8").then((buffer) => buffer.toString())
}

const replaceSep = (pathname) => pathname.replaceAll("/", path.sep)

const injectHead = (html, injected) => {
  const split = html.split(tagHeadEnd)
  return split[0] + injected + tagHeadEnd + split[1]
}

const tag = (tagName, content) => `<${tagName}>${content}</${tagName}>`

const logError = (msg) => (ex) => {
  console.error(PLUGIN_NAME + ": Error during " + msg + ": ", ex)
}

module.exports = {
  addAsset,
  transformAsset,
  mapCombinator,
  mergeDeep,
  readResource,
  injectHead,
  tag,
  replaceSep,
  logError,
  PLUGIN_NAME,
  CWD,
}
