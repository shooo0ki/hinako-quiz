import withPWA from "next-pwa";
import type { NextConfig } from "next";

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWAConfig(nextConfig);
