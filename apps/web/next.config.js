/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@campusos/shared'],
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4001/api/v1/:path*',
      },
      {
        source: '/api/docs',
        destination: 'http://localhost:4001/api/docs',
      },
    ];
  },
};

module.exports = nextConfig;
