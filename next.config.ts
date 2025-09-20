import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {ignoreBuildErrors: true},
  eslint: {ignoreDuringBuilds: true},
  serverExternalPackages: ["@prisma/client", "prisma"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclure les modules problématiques pour Vercel
      config.externals.push({
        'node:sqlite': 'commonjs node:sqlite',
        'sqlite3': 'commonjs sqlite3',
        'better-sqlite3': 'commonjs better-sqlite3'
      });
    }
    return config;
  },
};

export default nextConfig;
