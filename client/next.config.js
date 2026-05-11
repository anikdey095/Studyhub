/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Studyhub',
  assetPrefix: '/Studyhub',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
