import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.4.34'],
  transpilePackages: ['@react-pdf/renderer'],
};

export default nextConfig;
