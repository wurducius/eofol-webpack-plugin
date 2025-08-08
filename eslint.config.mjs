import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

const ignores = ["build/**/*.js", "node_modules/**/*.js", ".idea/**/*", "test/**/*", "dist/**/*", "project/**/*.js"]

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      semi: ["error", "never"],
      quotes: [2, "double", { avoidEscape: true }],
      "prefer-template": "error",
    },
    ignores,
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" }, ignores },
  { languageOptions: { globals: { ...globals.browser, ...globals.node, NodeJS: true } }, ignores },
  { ...pluginJs.configs.recommended, ignores },
  { ...tseslint.configs.base, ignores },
]
