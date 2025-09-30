import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sprint-sb-project.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/deokhugam/**"
      }
    ]
  },
  async rewrites() {
    // 모든 환경에서 rewrites 사용 (SSL 인증서 문제 해결을 위해)
    return [
      {
        source: "/api/:path*",
        destination:
          "http://sprint-project-1196140422.ap-northeast-2.elb.amazonaws.com/sb/deokhugam/api/:path*"
      }
    ];
  }
};

export default nextConfig;
