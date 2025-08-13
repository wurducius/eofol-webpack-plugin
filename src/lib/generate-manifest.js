// eslint-disable-next-line no-unused-vars
const manifestIconSizes = [
  { size: 48, title: "favicon" },
  { size: 192, title: "logo-sm" },
  { size: 320, title: "logo-md" },
  { size: 512, title: "logo-lg" },
]

const generateManifest = (data) => ({
  short_name: data.shortName ?? "short-name",
  name: data.name ?? "name",
  icons:
    data.icons && Array.isArray(data.icons)
      ? data.icons.map((icon) => ({
          src: icon.src,
          sizes: icon.sizes,
          type: icon.type ?? "image/png",
          purpose: icon.purpose ?? "any maskable",
        }))
      : [],
  start_url: data.startUrl ?? ".",
  display: data.display ?? "standalone",
  theme_color: data.themeColor ?? "#ff0000",
  background_color: data.bgColor ?? "#000000",
})

module.exports = generateManifest
