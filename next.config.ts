import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
