import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ده بيخلي Vercel يتجاهل أخطاء ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ده بيتجاهل أخطاء الـ TS وقت الـ build
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
