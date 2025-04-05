/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Disable unnecessary features in development
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize development performance
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },
}

module.exports = nextConfig; 