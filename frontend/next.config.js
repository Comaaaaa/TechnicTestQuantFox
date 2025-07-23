/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Enable standalone output for Docker
    outputFileTracingRoot: undefined,
  },
  // Disable telemetry
  telemetry: false,
  // Enable SWC minification
  swcMinify: true,
  // Configure images
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  // Configure webpack
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle in production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
