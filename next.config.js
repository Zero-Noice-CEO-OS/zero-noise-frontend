/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  basePath: '/zero-noise-frontend',
  assetPrefix: '/zero-noise-frontend/',
};

module.exports = nextConfig;