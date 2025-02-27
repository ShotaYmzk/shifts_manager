import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // 必要に応じて実験的機能を無効化
    //appDir: true,
  },
};

export default nextConfig;
