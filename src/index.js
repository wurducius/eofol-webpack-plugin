const precompile = require("./precompile")
const optimizeAssets = require("./optimize-assets")
const { PLUGIN_NAME, mergeDeep } = require("./util")

const onInitCompilation = (compiler, options) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: PLUGIN_NAME,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    async () => precompile(compiler, compilation, options),
  )
}

const onRunStarted = (compiler, options) => (compilation) => {
  compilation.hooks.run.tapPromise(
    {
      name: PLUGIN_NAME,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    async () => precompile(compiler, compilation, options),
  )
}

const onCompilationFinished = (compiler, options) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: PLUGIN_NAME,
      //   stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
      additionalAssets: true,
    },
    async (compiler) => optimizeAssets(compiler, compilation, options),
  )
}

const optionsDefault = {
  html: {
    template: [],
    header: {},
    injectBaseHeader: true,
    injectDoctype: true,
    minify: true,
    babelize: false,
  },
  css: {
    views: {},
    shared: [],
    injectViews: {},
    injectShared: [],
    inline: true,
    minify: true,
  },
  font: {
    path: "resources/Roboto-Regular.woff2",
    fontFamily: "Roboto",
    fontFamilyFallback: "sans-serif",
    format: "woff2",
    fontStyle: "normal",
    fontWeight: 400,
    fontDisplay: "swap",
    inline: false,
  },
  js: {
    inline: false,
    head: true,
    minify: true,
  },
  media: {
    optimizeImages: true,
    optimizeIcons: true,
    injectImageFallback: false,
  },
  inject: {
    manifest: true,
    robots: true,
    sw: true,
    errorOverlay: false,
    add: {},
    remove: {},
  },
  createDirectories: [],
  compress: false,
}

class EofolWebpackPlugin {
  options
  constructor(options = {}) {
    this.options = mergeDeep(optionsDefault ?? {}, options)
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, onInitCompilation(compiler, this.options))
    compiler.hooks.run.tap(PLUGIN_NAME, onRunStarted(compiler, this.options))
    compiler.hooks.compilation.tap(PLUGIN_NAME, onCompilationFinished(compiler, this.options))
  }
}

module.exports.default = EofolWebpackPlugin
