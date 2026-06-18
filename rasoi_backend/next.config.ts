import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', '@prisma/client', '@prisma/adapter-pg'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
