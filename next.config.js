/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
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