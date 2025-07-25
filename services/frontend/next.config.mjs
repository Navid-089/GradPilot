/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://gradpilot.me/api',
  },
   async rewrites() {
    return [
      {
        source: '/api/recommendations/:path*',
        destination: 'http://gradpilot-recommendation:8083/api/recommendations/:path*',
      },
    ];
  },
}

export default nextConfig
