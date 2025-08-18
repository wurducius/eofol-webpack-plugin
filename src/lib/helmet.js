const { mergeDeep } = require("../util")
const { helmetTemplate } = require("./resources/head")

const helmetJsonDefault = {
  title: "title",
  theme: "#000000",
  description: "description",
}

const helmet = (args) => {
  const data = mergeDeep(helmetJsonDefault, args)
  return helmetTemplate(data)
}

module.exports = helmet
