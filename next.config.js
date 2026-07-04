/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  basePath: isProd ? '/zero-noise-frontend' : '',
  assetPrefix: isProd ? '/zero-noise-frontend/' : '',
};

module.exports = nextConfig;