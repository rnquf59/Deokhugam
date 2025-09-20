import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-sb-project.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/deokhugam/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://sprint-project-1196140422.ap-northeast-2.elb.amazonaws.com/sb/deokhugam/api/:path*',
      },
    ];
  },
};

export default nextConfig;
