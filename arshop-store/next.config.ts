import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "cdn.shopify.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
