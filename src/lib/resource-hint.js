const resourceHint = (options) => {
  const preload = options.preload.map((item) => {
    const isString = typeof item === "string"
    const href = isString ? item : item.url
    const fetchPriority = isString ? false : item.fetchPriority
    const as = isString ? false : item.as
    return `<link rel="preload" href="${href}" ${as ? `as="${as}"` : ""} ${fetchPriority ? `fetchpriority="${fetchPriority}"` : ""} />`
  })

  const prefetch = options.prefetch.map((item) => {
    const isString = typeof item === "string"
    const href = isString ? item : item.url
    const as = isString ? false : item.as
    return `<link rel="prefetch" href="${href}" ${as ? `as="${as}as"` : ""} />`
  })

  const preconnect = options.preconnect.map((item) => {
    const isString = typeof item === "string"
    const href = isString ? item : item.url
    const crossorigin = !isString && item.crossorigin
    const credentials = isString ? false : item.credentials
    return `<link rel="preconnect" href="${href}" ${crossorigin ? "crossorigin" : ""} ${credentials ? `credentials="${credentials}"` : ""} />`
  })

  return [...preload, ...prefetch, ...preconnect].join("\n")
}

module.exports = resourceHint
