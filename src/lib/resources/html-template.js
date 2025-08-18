const { tag } = require("../../util")

const doctype = "<!DOCTYPE html>"

const htmlTemplate = (body, styles, pageTitle, script, head) => `
<html lang="en">
    <head>
        ${styles ? tag("style", styles) : ""}
        ${pageTitle ? tag("title", pageTitle) : ""}
        ${script ? tag("script", script) : ""}
        ${head ?? ""}
    </head>
    <body>
        ${body}
    </body>
    <noscript>
        You need to enable JavaScript to run this app.
    </noscript>
</html>
`

module.exports = { doctype, htmlTemplate }
