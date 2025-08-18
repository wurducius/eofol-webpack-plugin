const baseHead = '<meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport">'

const helmetTemplate = (data) => `
<link href="${data.imageSrc}" rel="icon">
<link href="./manifest.json" rel="manifest">
<meta content="${data.description}" name="description">
<meta name="keywords" content="${data.keywords}">
<meta content="${data.title}" property="og:title">
<meta content="${data.imageType}" property="og:type">
<meta content="${data.url}" property="og:url">
<meta content="${data.imageSrc}" property="og:image">
<meta content="${data.imageAlt}" property="og:image:alt">
<link href="${data.imageSrc}" rel="apple-touch-icon">
<meta content="${data.theme}" name="theme-color">
<title>${data.title}</title>
`

module.exports = { helmetTemplate, baseHead }
