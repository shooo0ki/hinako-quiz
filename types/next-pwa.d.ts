declare module "next-pwa" {
  import type { NextConfig } from "next";

  type WithPWA = (config: NextConfig) => NextConfig;

  interface PWAOptions {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: unknown;
  }

  export default function withPWA(options?: PWAOptions): WithPWA;
}
