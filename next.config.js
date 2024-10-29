/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    optimizePackageImports: ["@chakra-ui/react"],
  },
}
