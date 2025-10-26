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

  // ✅ Configuration compatible Turbopack
  // Le PrismaPlugin n'est pas nécessaire (seulement pour monorepos)
  // Turbopack gère Prisma nativement avec prisma generate
};

export default nextConfig;
