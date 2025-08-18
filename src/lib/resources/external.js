const { SW_FILES_MARKER } = require("../../constants")

const robotsContent = `
User-agent: *\n
Allow: /
`

const swContent = `
let CACHE_NAME = "cache",
  CACHE_VERSION = "v1",
  cacheId = CACHE_NAME + "-" + CACHE_VERSION,
  urlsToCache = [${SW_FILES_MARKER}]

self.addEventListener("install", (s) => {
  s.waitUntil(caches.open(cacheId).then((s) => Promise.all(urlsToCache.map((e) => s.add(e)))))
})
`
const imgFallbackContent =
  '<svg width="800px" height="800px" viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>image_picture [#971]</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-420.000000, -3881.000000)" fill="#000000"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M376.083,3725.667 C376.083,3724.562 376.978,3723.667 378.083,3723.667 C379.188,3723.667 380.083,3724.562 380.083,3725.667 C380.083,3726.772 379.188,3727.667 378.083,3727.667 C376.978,3727.667 376.083,3726.772 376.083,3725.667 L376.083,3725.667 Z M382,3733.086 L377.987,3729.074 L377.971,3729.089 L377.955,3729.074 L376.525,3730.504 L371.896,3725.876 L371.881,3725.892 L371.865,3725.876 L366,3731.741 L366,3723 L382,3723 L382,3733.086 Z M364,3737 L384,3737 L384,3721 L364,3721 L364,3737 Z" id="image_picture-[#971]"></path></g></g></g></svg>'

const skeletonContent =
  '<svg width="800px" height="800px" viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>align_text_left [#910]</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-60.000000, -4201.000000)" fill="#000000"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M4,4057 L24,4057 L24,4055 L4,4055 L4,4057 Z M4,4043 L24,4043 L24,4041 L4,4041 L4,4043 Z M4,4050 L18,4050 L18,4048 L4,4048 L4,4050 Z" id="align_text_left-[#910]"></path></g></g></g></svg>'

module.exports = { robotsContent, swContent, imgFallbackContent, skeletonContent }
