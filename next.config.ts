import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are served straight from /public so the sandbox build never needs
  // a sharp install at runtime.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
