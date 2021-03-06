const withPlugins = require("next-compose-plugins")
const withFonts = require("next-fonts")
const withOptimizedImages = require("next-optimized-images")
const sharp = require("responsive-loader/sharp")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
// const withCSS = require("@zeit/next-css")
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
})

const nextConfiguration = {
  publicRuntimeConfig: {
    localeSubpaths:
      typeof process.env.LOCALE_SUBPATHS === "string"
        ? process.env.LOCALE_SUBPATHS
        : "none",
  },

  webpack(config) {
    /*     try {
      config.optimization.splitChunks.cacheGroups.commons.enforce = true
      config.optimization.splitChunks.cacheGroups.commons.priority = 9
      config.optimization.splitChunks.cacheGroups.react.priority = 12
      config.optimization.splitChunks.cacheGroups.formikCommons = {
        chunks: "all",
        enforce: true,
        minChunks: 1,
        name: "formik-commons",
        priority: 10,
        test: /[\\\/](node_modules[\\\/](lodash[\\\/]|(formik|lodash-es|yup|react-ga)[\\\/]))/,
      }
      config.optimization.splitChunks.cacheGroups.xlsx = {
        chunks: "all",
        enforce: true,
        minChunks: 1,
        name: "xlsx",
        priority: 10,
        test: /[\\\/](node_modules[\\\/]xlsx[\\\/])/,
      }
    } catch (e) {
      // fall through
    } */

    return config
  },
}

module.exports = withPlugins(
  [
    withFonts,
    [
      withOptimizedImages,
      {
        handleImages: ["jpeg", "png", "svg", "webp", "gif"],
        overwriteImageLoaderPaths: require.resolve.paths("")[0],
        optimizeImages: true,
        optimizeImagesInDev: true,
        webp: {
          preset: "default",
          quality: 75,
        },
        inlineImageLimit: -1,
        responsive: {
          adapter: sharp,
          placeholder: true,
          placeholderSize: 50,
          optimizeImagesInDev: true,
        },
      },
    ],
    withBundleAnalyzer,
    // withCSS,
    withMDX,
  ],
  nextConfiguration,
)
