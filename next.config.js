/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    externalDir: true,
    optimizePackageImports: ["@chakra-ui/react"]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  }
}
